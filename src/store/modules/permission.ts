import { RouteRecordRaw } from "vue-router";
import { defineStore } from "pinia";
import { constantRoutes } from "@/router";
import { store } from "@/store";

// setup
export const usePermissionStore = defineStore(
  "permission",
  () => {
    // state
    const routes = ref<RouteRecordRaw[]>([]);

    // actions
    function setRoutes(newRoutes: RouteRecordRaw[]) {
      routes.value = constantRoutes.concat(newRoutes);
    }

    return { routes, setRoutes };
  }
);

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
