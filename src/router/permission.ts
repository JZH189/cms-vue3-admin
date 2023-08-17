import router from "@/router";
import { useUserStoreHook } from "@/store/modules/user";
import { transformMenuToRoute } from "@/router/helper";
import { MenuTypeEnum } from "@/enums/MenuTypeEnum";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { isUrl } from "@/utils/is";
import { warn } from "@/utils/log";
import { filter, listToTree } from "@/utils/tree";

NProgress.configure({ showSpinner: false }); // 进度条

interface Menu {
  id: number;
  parentId?: number;
  name: string;
  router: string;
  type: number;
  icon: string;
  orderNum?: number;
  viewPath?: string;
  isShow?: boolean;
  activeRouter?: string;
  children?: Menu[];
}

// 白名单路由
const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const hasToken = localStorage.getItem("accessToken");
  if (hasToken) {
    if (to.path === "/login") {
      // 如果已登录，跳转首页
      next({ path: "/" });
      NProgress.done();
    } else {
      const userStore = useUserStoreHook();
      const hasMenus = userStore.menus && userStore.menus.length > 0;
      if (hasMenus) {
        // 未匹配到任何路由，跳转404
        if (to.matched.length === 0) {
          from.name ? next({ name: from.name }) : next("/404");
        } else {
          next();
        }
      } else {
        try {
          const routeRemoveIllegalFilter = (menu: Menu): boolean => {
            if (menu.type === MenuTypeEnum.Permission) {
              return false;
            }
            if (!menu.router?.startsWith("/") && !isUrl(menu.router)) {
              warn(`此路由${menu.router}不合法，需以/或者合法的url开头。`);
              return false;
            }
            return true;
          };
          const { menus } = await userStore.getPermmenu();
          // 过滤不合法的路由，避免不合法路径导致vue-router进入死循环
          let menusTree = filter(menus, routeRemoveIllegalFilter);
          // list to tree
          menusTree = listToTree(menusTree);
          console.log("menusTree: ", JSON.stringify(menusTree));
          //转成真实路由对象
          const asyncRoutes = transformMenuToRoute(menusTree);
          console.log("asyncRoutes: ", JSON.stringify(asyncRoutes));
          asyncRoutes.forEach((route) => {
            router.addRoute(route);
          });
          router.getRoutes();
          next({ ...to, replace: true });
        } catch (error) {
          // 移除 token 并跳转登录页
          await userStore.resetToken();
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    // 未登录可以访问白名单页面
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
