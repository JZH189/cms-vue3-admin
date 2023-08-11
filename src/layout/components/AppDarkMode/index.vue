<script setup lang="ts">
import IconEpSunny from "~icons/ep/sunny";
import IconEpMoon from "~icons/ep/moon";

/**
 * 暗黑模式
 */
const isDark = useDark();
const toggleDark = () => useToggle(isDark);
</script>

<template>
  <el-switch
    v-model="isDark"
    inline-prompt
    :active-icon="IconEpMoon"
    :inactive-icon="IconEpSunny"
    active-color="var(--el-fill-color-dark)"
    inactive-color="var(--el-color-primary)"
    @change="toggleDark"
  />
</template>