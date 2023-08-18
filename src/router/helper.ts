import { RouteMeta, RouteRecordRaw } from "vue-router";
import { Menu } from "./typing";
import { isUrl } from "@/utils/is";
import { MenuTypeEnum } from "@/enums/MenuTypeEnum";
import { Layout } from "./index";

const modules = import.meta.glob("@/views/**/**.vue");

export function transformMenuToRoute(menus: Menu[]): RouteRecordRaw[] {
  return menus.map((menu): RouteRecordRaw => {
    const meta: RouteMeta = {
      title: menu.name,
      icon: menu.icon,
      hidden: !menu.isShow,
      keepAlive: true,
    };

    // 目录
    if (menu.type === MenuTypeEnum.Catalogue) {
      const route: RouteRecordRaw = {
        name: menu.router,
        path: menu.router,
        component: Layout,
        meta,
        children: [],
      };

      if (menu.children && menu.children.length > 0) {
        route.children = transformMenuToRoute(menu.children);
        // 目录时则尝试重定向至默认首个子项路径
        route.redirect = route.children[0].path;
      }
      return route;
    }

    // 外链
    if (isUrl(menu.router)) {
      return {
        path: `/external-link`,
        name: menu.router,
        component: Layout,
        meta: {
          title: menu.name,
          icon: "link",
        },
        children: [
          {
            path: menu.router,
            component: () => undefined,
            meta,
          },
        ],
      };
    }

    //菜单
    const route: RouteRecordRaw = {
      name: menu.router,
      path: menu.router,
      component:
        modules[`@/views${menu.router}/index.vue`] ??
        modules[`@/views/error-page/404.vue`],
      meta,
    };
    return route;
  });
}
