import axios from "axios";
import { useUserStoreHook } from "@/store/modules/user";
import { isProdMode } from "@/utils/index";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

type Result<T = any> = {
  msg: string;
  code: number;
  data?: T;
};

function showConfirm(message: string, showCancelButton = false) {
  ElMessageBox.confirm(message, "提示", {
    confirmButtonText: "确定",
    showCancelButton: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: "warning",
  }).then(() => {
    localStorage.clear();
    window.location.href = "/";
  });
}

// 导出Request类，可以用来自定义传递配置来创建实例
export default class Request {
  // axios 实例
  private instance: AxiosInstance;
  // 基础配置，url和超时时间
  private baseConfig: AxiosRequestConfig = {
    baseURL: isProdMode() ? import.meta.env.VITE_APP_BASE_API : "",
    timeout: 60000,
  };

  constructor(config?: AxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config));
    // 设置请求和响应拦截
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  // 请求拦截
  private httpInterceptorsRequest() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const userStore = useUserStoreHook();
        if (userStore.token) {
          config.headers.Authorization = userStore.token;
        }
        return config;
      },
      (err: AxiosError) => {
        return Promise.reject(err);
      }
    );
  }

  // 响应拦截
  private httpInterceptorsResponse() {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { code, msg } = response.data;
        // 响应数据为二进制流处理
        if (response.data instanceof ArrayBuffer) {
          return response;
        }
        if (code === 200) {
          //仅返回业务所需字段
          return response.data.data;
        }
        if (code === 401) {
          showConfirm(msg);
          return Promise.reject(new Error("授权已失效"));
        }
        ElMessage.error(msg);
        return Promise.reject(new Error(msg));
      },
      (error: AxiosError) => {
        // 当响应异常时做一些处理
        if (error && error.response) {
          switch (error.response.status) {
            case 400:
              error.message = "请求错误(400)";
              break;
            case 401:
              error.message = "授权已失效，请重新登录(401)";
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
          if (error.response.status < 500) {
            showConfirm(error.message);
          } else {
            ElMessage.error(error.message);
          }
          return Promise.reject(new Error(error.message));
        }
        showConfirm(`请求错误：${error.message}`);
        return Promise.reject(error.message);
      }
    );
  }

  // 定义request。类型参数的作用，T决定AxiosResponse实例中data的类型
  public request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<T, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((err: AxiosError) => {
          reject(err);
        });
    });
  }

  public get<T = any>(config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "GET" });
  }

  public post<T = any>(config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "POST" });
  }

  public put<T = any>(config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "PUT" });
  }

  public delete<T = any>(config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE" });
  }
}

export const API = new Request();
