<script setup lang="ts">
import { useRoute } from "vue-router";
import SidebarItem from "./SidebarItem.vue";
import Logo from "./Logo.vue";

import { useSettingsStore } from "@/store/modules/settings";
import { usePermissionStore } from "@/store/modules/permission";
import { useAppStore } from "@/store/modules/app";
import { storeToRefs } from "pinia";
import variables from "@/styles/variables.module.scss";

const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const appStore = useAppStore();
const currRoute = useRoute();
const { sidebarLogo } = storeToRefs(settingsStore);
// safe icon ,前端需要用到的动态icons必须要在此定义，否则无法显示图标
const safeIcons = [
  "i-carbon:dashboard",
  "i-carbon:catalog",
  "i-carbon:align-box-middle-right",
  "i-carbon:settings",
  "i-carbon:cics-system-group",
  "i-carbon:grid",
  "i-carbon:user-role",
  "i-carbon:user",
  "i-carbon:application-web",
  "i-carbon:data-volume",
  "i-carbon:data-1",
  "i-carbon:ibm-cloud-hyper-protect-crypto-services"
];
</script>

<template>
  <div :class="{ 'has-logo': sidebarLogo }">
    <logo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" />
    <el-scrollbar>
      <el-menu
        :default-active="currRoute.path"
        :collapse="!appStore.sidebar.opened"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="true"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permissionStore.routes"
          :key="route.path"
          :item="route as any"
          :base-path="route.path"
          :is-collapse="!appStore.sidebar.opened"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
