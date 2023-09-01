<template>
  <!-- 列设置 -->
  <el-drawer 
    v-model="drawerVisible"
    title="列设置" 
    :size="elDrawerWidth"
    @close="drawerClose">
    <el-table :data="prop.colSetting" :border="true" row-key="prop" default-expand-all :tree-props="{ children: '_children' }">
      <el-table-column prop="label" align="center" label="列名" />
      <el-table-column prop="visiable" align="center" label="显示">
        <template #default="{row}">
          <el-switch v-model="row.visiable" />
        </template>
      </el-table-column>
      <template #empty>
        <div class="table-empty">
          <img src="@/assets/images/notData.png" alt="notData" />
          <div>暂无可配置列</div>
        </div>
      </template>
    </el-table>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWindowSizeFn } from '@/hooks/useWindowSizeFn'
import { areMobile } from '@/hooks/useAgent'

interface ColumnItem {
  visiable?: boolean; // 是否显示在表格当中
 [key: string]: any
}
interface ColumnProps {
  colSetting: ColumnItem[]
}
const emit = defineEmits<{
  (e: 'colChanged', columns: any[]): void
}>()
function drawerClose() {
  emit('colChanged', prop.colSetting)
}
const prop = defineProps<ColumnProps>()
const drawerVisible = ref(false)
// 打开列设置
const openColSetting = () => {
	drawerVisible.value = true
}
const elDrawerWidth = ref('450px')
//列宽度自适应
useWindowSizeFn(() => {
  elDrawerWidth.value = areMobile() ? '100%' : '450px'
}, 0, {
  immediate: true
})
defineExpose({
	openColSetting
})
</script>

<style scoped lang="scss">
.cursor-move {
	cursor: move;
}
</style>
