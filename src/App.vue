<script setup lang="ts">
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { ElConfigProvider } from "element-plus";
import { useAppStore } from "@/store/modules/app";
const appStore = useAppStore();
</script>

<template>
  <el-config-provider :size="appStore.size" :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
