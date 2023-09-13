<script setup lang="ts">
const lightIcon = h('span', { class: 'i-carbon:sun text-yellow-300' })
const darkIcon = h('span', { class: 'i-carbon:haze-night text-purple-300' })

/**
 * 暗黑模式
 */
const isDark = useDark();
const toggleDark = () => useToggle(isDark);
</script>

<template>
  <el-switch
    v-model="isDark"
    :active-icon="darkIcon"
    :inactive-icon="lightIcon"
    inline-prompt
    :style="{
      '--el-switch-on-color': '#141414',
      '--el-switch-off-color': '#141414',
    }"
    @change="toggleDark"
  />
</template>