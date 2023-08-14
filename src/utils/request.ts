import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useUserStoreHook } from "@/store/modules/user";
import { isProdMode } from "@/utils/index";

// 创建 axios 实例
const service = axios.create({
  baseURL: isProdMode() ? "" : import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStoreHook();
    if (userStore.token) {
      config.headers.Authorization = userStore.token;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse): any => {
    const { code, msg } = response.data;
    // 响应数据为二进制流处理(Excel导出)
    if (response.data instanceof ArrayBuffer) {
      return response;
    }
    if (code === 200) {
      //仅返回业务所需字段
      return response.data.data;
    }
    if (code === 401) {
      ElMessageBox.confirm("授权已失效，请重新登录", "提示", {
        confirmButtonText: "确定",
        type: "warning",
      }).then(() => {
        localStorage.clear();
        window.location.href = "/";
      });
      return Promise.reject(new Error("授权已失效"));
    }
    ElMessage.error(msg || "系统出错");
    return Promise.reject(new Error(msg || "Error"));
  },
  (error: any): any => {
    // 当响应异常时做一些处理
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误(400)";
          break;
        case 401:
          error.message = "未授权，请重新登录(401)";
          break;
        case 403:
          error.message = "拒绝访问(403)";
          break;
        case 404:
          error.message = "请求出错(404)";
          break;
        case 408:
          error.message = "请求超时(408)";
          break;
        case 500:
          error.message = "服务器错误(500)";
          break;
        case 501:
          error.message = "服务未实现(501)";
          break;
        case 502:
          error.message = "网络错误(502)";
          break;
        case 503:
          error.message = "服务不可用(503)";
          break;
        case 504:
          error.message = "网络超时(504)";
          break;
        case 505:
          error.message = "HTTP版本不受支持(505)";
          break;
        default:
          error.message = `连接出错(${error.response.status})!`;
      }
      return Promise.reject(error.message);
    }
    ElMessageBox.confirm(`请求方式错误：${error.message}`, "提示", {
      confirmButtonText: "确定",
      showCancelButton: false,
      type: "warning",
    });
    return Promise.reject(error.message);
  }
);

// 导出 axios 实例
export default service;
