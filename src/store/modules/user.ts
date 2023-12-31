import { defineStore } from "pinia";
import { resetRouter } from "@/router";
import { store } from "@/store";
import { useStorage } from "@vueuse/core";
import { LoginData, LoginInfo, LoginResult, Permmenu } from "@/types/account";
import { encrypt } from "@/utils";

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
        const loginResult = await API.post<LoginResult>({
          url: "/admin/sys/user/login",
          data: encrypt(JSON.stringify(loginData)), //加密传输
        });
        token.value = loginResult.token;
        resolve();
      } catch (error) {
        console.log("error: ", error);
        reject(error);
      }
    });
  }

  // 获取登录用户信息
  function getInfo() {
    return new Promise<LoginInfo>(async (resolve, reject) => {
      try {
        const loginInfo = await API.get<LoginInfo>({
          url: "/admin/sys/user/userInfo",
        });
        nickname.value = loginInfo.userName;
        avatar.value = loginInfo.avatar;
        resolve(loginInfo);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 获取权限菜单
  function getPermmenu() {
    return new Promise<Permmenu>(async (resolve, reject) => {
      try {
        const res = await API.get<Permmenu>({
          url: "/admin/sys/user/permmenu",
        });
        menus.value = res.menus;
        perms.value = res.perms;
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 退出登录
  function logout() {
    return new Promise<void>((resolve, reject) => {
      API.post({ url: "/admin/sys/user/logout" })
        .then(() => {
          resetRouter();
          resetToken();
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
    getInfo,
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
