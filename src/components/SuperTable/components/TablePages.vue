<template>
  <div ref="wrapRef">
    <search-form
    ref="formRef"
    :form-data="props.formData"
    :rules="props.formRules"
    :label-width="props.labelWidth"
    @on-search="queryForm"
    @on-reset="resetForm"
    ></search-form>
    <!-- 表格操作按钮 -->
    <div f-b-c mb-2>
      <div class="header-button-lf">
        <slot name="tableHeader"></slot>
      </div>
      <div class="header-button-ri">
        <FullscreenSetting />
        <el-button
          style="padding: 0px; border: none"
          size="small" @click="openColSetting">
          <i class="i-carbon:settings-adjust" style="width: 26px;height: 26px;"></i>
        </el-button>
        <el-button 
          style="padding: 0px; border: none"
          size="small" @click="toggleForm">
          <i class="i-carbon:search" style="width: 26px;height: 26px;"></i>
        </el-button>
      </div>
    </div>
    <!-- 表格部分 -->
    <el-table
      ref="tableRef"
      v-bind="mergeAttrs"
      v-loading="loading"
      :data="tableList"
      :height="tableHeight"
      @row-dblclick="onRowDblclick">
      <defaultSlots :key="key" />
    </el-table>
    <!-- 分页部分 -->
    <el-pagination 
      v-if="props.showPages"
      ref="pageRef" 
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      class="pagination" 
      :page-sizes="pagination.pageSizes"
      :total="pagination.total"
      small
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
    <!-- 列设置 -->
    <ColSetting 
      ref="colRef"
      :col-setting="tableColumns.slot"
      @col-changed="updateColumn" />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  ref,
  readonly,
  onMounted,
  nextTick,
  toRaw,
} from 'vue'
import SearchForm from './SearchForm.vue'
import ColSetting from './ColSetting.vue'
import FullscreenSetting from './FullscreenSetting.vue'
import { useWindowSizeFn } from '@/hooks/useWindowSizeFn'
import { useTable } from '../hooks/useTable'
import { createTableContext } from '../hooks/useTableContext'
import { usePagination } from '../hooks/usePagination'
import type { FormRules } from "element-plus";

interface ItableProp {
  formData: any; //表单字段
  queryApi: string; //请求api
  formRules?: FormRules; //表单验证
  labelWidth?: string | number;
  summaryMethod?: Function,
  showSummary?: boolean,
  stripe?: boolean //是否开启斑马条纹
  border?: boolean //是否显示边框
  highlightCurrentRow?: boolean //高亮当前行
  emptyText?: string //无数据的时候显示文字
  showPages?: boolean //是否展示分页
}
// 定义props
const props = withDefaults(defineProps<ItableProp>(), {
  formRules: undefined,
  labelWidth: undefined,
  summaryMethod: undefined,
  showSummary: false,
  stripe: true,
  border: true,
  highlightCurrentRow: true,
  emptyText: '暂无数据',
  showPages: true
})
const emit = defineEmits<{
  (e: 'toggleForm', val: boolean): void,
  (e: 'rowDblclick', val: object): void,
}>()

//table设置
const {
  multipleSelection,
  tableHeight,
  getTableHeight,
  mergeAttrs,
  key,
  tableColumns,
  defaultSlots,
} = useTable(props)

const formRef = ref()

//获取分页数据和请求状态
const { loading, doSearch, doReset, tableList, pagination } = usePagination(props.queryApi)

//表单查询
function queryForm(formData) {
  doSearch(formData)
}

//表单重置
function resetForm(formData) {
  doReset(formData)
}

//获取表单数据
function getFormData(){
  return formRef.value?.formData || {}
}

//当某一行被双击时
function onRowDblclick(row) {
  emit('rowDblclick', row)
}

//每页最大条数值变化的方法
function handleSizeChange(val: number): void {
  pagination.pageSize = val
  doSearch(getFormData())
}
//页码数据变化的方法
function handleCurrentChange(val: number): void {
  pagination.currentPage = val
  doSearch(getFormData())
}
//显/隐列信息
function updateColumn(val: any[]) {
  tableColumns.storage = val
}

const showForm = ref(true)
const wrapRef = ref()
const tableRef = ref()
const pageRef = ref()
const colRef = ref()
//列设置
function openColSetting() {
  colRef.value.openColSetting()
}
async function toggleForm() {
  showForm.value = !showForm.value
  emit('toggleForm', showForm.value)
  await nextTick()
  getTableHeight()
}
//监听window.resize事件
useWindowSizeFn(getTableHeight)
createTableContext({ wrapRef, tableRef })
defineExpose({
  showForm: toRaw(showForm), //是否显示表单
  selections: toRaw(multipleSelection), //多选的记录数据
  clearSelection: function () {
    tableRef.value.clearSelection()
  },
  // 列的数据
  columns: computed(() => readonly(tableColumns.render)),
  doSearch,
  doReset,
})
onMounted(() => {
  getTableHeight()
})
</script>

<style lang="scss" scoped>
.tableForm {
  margin-bottom: 20px;
  :deep(.el-form) {
    display: grid;
    grid-template-columns: repeat(auto-fill, 320px);
    grid-gap: 10px;
    .el-form-item__label {
      width: 100px;
    }
  }
}
.table-header {
  width: 100%;
  height: 44px;
}
.pagination {
  padding: 10px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}
</style>
