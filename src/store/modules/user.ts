import { defineStore } from "pinia";
import { resetRouter } from "@/router";
import { store } from "@/store";
import { useStorage } from "@vueuse/core";
import { LoginData, LoginInfo, LoginResult, Permmenu } from "@/types/account";
import { encrypt, decrypt } from '@/utils';

export const useUserStore = defineStore(
  "user",
  () => {
    // state
    const userId = ref();
    const token = useStorage("accessToken", "");
    const nickname = ref("");
    const avatar = ref("");
    const menus = ref<Array<any>>([]); // 用户菜单权限
    const perms = ref<Array<string>>([]); // 用户权限
    const publicKey = ref(
      "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4lhLJWccQz6lttR2SYDE\nICrCIa5YLcO1wccyncir5FFN797bK+5S5Cfbvxdpc8CK4Sii6aOkbdf8Cc4nhFpV\nDu2mxMw6cqeNLahUp5jTkHcFOYOTMBe+7grR1iRfg1DLO1Nwt7G7FUefDkK3yfiw\nx0IWGIsbR6yqeKXijFWBPtTwzlbkeENapWsqOaq82atBDAgTIPJY7zdD9J/wFilH\nTihUW0AegLDzmfoDxSZELKbX2pT5wBTSX8FrBDjE5T22MgYbX5jT15LC3jPss72P\nyShBkr2v+XoHLo2iUcDcjLdujU9P1LbYkTn5dhehkOQxbxQ+R6aOVfyKNdiMItVG\nzQIDAQAB\n-----END PUBLIC KEY-----"
    );  //公钥

    /**
     * 登录调用
     *
     * @param {LoginData}
     * @returns
     */
    async function login(loginData: any) {
      return new Promise<void>(async (resolve, reject) => {
        try {
          const loginResult = await API.post<LoginResult>({
            url: "/admin/sys/user/login",
            data: loginData,
          });
          console.log('loginResult---: ', loginResult);
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
      publicKey,
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
  }
);

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
