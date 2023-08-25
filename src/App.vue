<script setup lang="ts">
import { ElConfigProvider } from "element-plus";
import { useAppStore } from "@/store/modules/app";
const appStore = useAppStore();
</script>

<template>
  <el-config-provider :size="appStore.size">
    <router-view />
  </el-config-provider>
</template>
