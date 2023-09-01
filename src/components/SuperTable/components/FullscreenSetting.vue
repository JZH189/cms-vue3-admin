<template>
  <el-button v-if="isFullscreen" style="padding: 0px;border: none;" size="small" @click="toggle">
    <i class="i-carbon:shrink-screen" style="width: 26px;height: 26px;"></i>
  </el-button>
  <el-button v-else style="padding: 0px;border: none;" size="small" @click="toggle">
    <i class="i-carbon:fit-to-screen" style="width: 26px;height: 26px;"></i>
  </el-button>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { useTableContext } from '../composables/useTableContext'
const table = useTableContext()
const { isFullscreen, toggle } = useFullscreen(table.wrapRef)
</script>
