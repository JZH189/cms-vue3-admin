import request from "@/utils/request";
import { defineStore } from "pinia";
import { logoutApi } from "@/api/auth";
import { resetRouter } from "@/router";
import { store } from "@/store";
import { useStorage } from "@vueuse/core";
import { LoginData, LoginInfo, LoginResult, Permmenu } from "@/types/account";

export const useUserStore = defineStore("user", () => {
  // state
  const userId = ref();
  const token = useStorage("accessToken", "");
  const nickname = ref("");
  const avatar = ref("");
  const menus = ref<Array<any>>([]); // 用户菜单权限
  const perms = ref<Array<string>>([]); // 用户权限

  /**
   * 登录调用
   *
   * @param {LoginData}
   * @returns
   */
  async function login(loginData: LoginData) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const loginResult = await request<LoginResult>({
          url: "/api/admin/sys/user/login",
          method: "post",
          data: loginData,
        });
        token.value = loginResult.data.token;
        const loginInfo = await request<LoginInfo>({
          url: "/api/admin/sys/user/info",
          method: "get",
        });
        nickname.value = loginInfo.data.username;
        avatar.value = loginInfo.data.avatar;
        resolve();
      } catch (error) {
        console.log("error: ", error);
        reject(error);
      }
    });
  }

  // 获取权限菜单
  function getPermmenu() {
    return new Promise<Permmenu>(async (resolve, reject) => {
      try {
        const { data } = await request<Permmenu>({
          url: "/api/admin/sys/user/permmenu",
          method: "get",
        });
        menus.value = data.menus;
        perms.value = data.perms;
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 注销
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          resetRouter();
          resetToken();
          location.reload(); // 清空路由
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 重置
  function resetToken() {
    token.value = "";
    nickname.value = "";
    avatar.value = "";
    menus.value = [];
    perms.value = [];
  }
  return {
    token,
    nickname,
    avatar,
    menus,
    perms,
    login,
    getPermmenu,
    logout,
    resetToken,
    /**
     * 当前登录用户ID
     */
    userId,
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
