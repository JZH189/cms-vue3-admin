<script lang="ts" setup>
import SuperTable from "@/components/SuperTable";
import listToTree from "@/utils/listToTree";
import SearchForm, {
  FormItemType,
  FormItemLayout,
} from "@/components/SearchForm";

let isAdd = ref(false)
let formBtnLoading = false
let deleteMenuLoading = false
const superTableRef = ref()
const dialogFormVisible = ref(false);
const formData = ref([
  {
    label: "类型：",
    key: "type",
    type: FormItemType.radio,
    opts: [
      {
        label: "目录",
        value: 0,
      },
      {
        label: "菜单",
        value: 1,
      },
      {
        label: "权限",
        value: 2,
      },
    ],
    value: undefined,
    attrs: {
      disabled: !isAdd.value
    }
  },
  {
    label: "菜单名称：",
    key: "name",
    type: FormItemType.input,
    value: undefined,
    attrs: {
      maxLength: "20",
      showWordLimit: true,
    },
  },
  {
    label: "父级菜单：",
    key: "parentId",
    type: FormItemType.input,
    value: undefined,
    attrs: {
      disabled: !isAdd.value
    }
  },
  {
    label: "路由：",
    key: "router",
    type: FormItemType.input,
    value: undefined,
    attrs: {
      maxLength: "20",
      showWordLimit: true,
    },
  },
  {
    label: "图标：",
    key: "icon",
    type: FormItemType.input,
    value: undefined,
    prepend: "i-",
    attrs: {
      maxLength: "20",
      showWordLimit: true,
    },
  },
  {
    label: "状态：",
    key: "isShow",
    type: FormItemType.radio,
    value: 1,
    opts: [
      {
        label: "显示",
        value: 1,
      },
      {
        label: "隐藏",
        value: 0,
      },
    ],
  },
  {
    label: "排序：",
    key: "orderNum",
    type: FormItemType.input,
    value: 0,
  },
]);

const rules = reactive({
  type: [
    { required: true, message: "请选择类型", trigger: ["change", "blur"] },
  ],
  name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  parentId: [
    { required: true, message: "请选择父级菜单", trigger: ["change", "blur"] },
  ],
  router: [{ required: true, message: "请输入路由", trigger: "blur" }],
});

const srarchForm = ref();

const rowData: any = reactive({})

function cancel() {
  srarchForm.value?.resetForm();
  dialogFormVisible.value = false;
  formBtnLoading = false
}

function confirm() {
  srarchForm.value?.submitForm();
}

let tableData: any = []

function dataChanged(val) {
  tableData = val
}

function delRow(raw: any) {
  ElMessageBox.confirm('确定删除此记录？',
  {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  .then(async () => {
      deleteMenuLoading = true
      await API.post({
        url: '/admin/sys/perm/menu/deleteMenu',
        data: {
          id: raw.id
        }
      }).finally(() => {
        deleteMenuLoading = false
        superTableRef.value.doSearch()
      })
    })
}

function updateRow(val) {
  formBtnLoading = true
  API.post({
    url: '/admin/sys/perm/menu/updateMenu',
    data: {
      ...val,
      id: rowData.id
    }
  })
    .then(() => {
    formBtnLoading = false
  })
}

function editRow(raw: any) {
  Object.assign(rowData, raw)
  formData.value.forEach(item => {
    if (item.key === 'parentId') {
      const value = raw[item.key]
      const current = tableData.filter(item => item.id === value)
      if (current.length) {
        item.value = current[0]['name']
      } else {
        item.value = 0
      }
    } else {
      item.value = raw[item.key]
    }
  })
  dialogFormVisible.value = true
}

function addPerm() {
  isAdd.value = true
  dialogFormVisible.value = true
  //todo
}
</script>

<template>
  <SuperTable
    ref="superTableRef"
    query-api="/admin/sys/perm/menu/menuList"
    no-form
    row-key="id"
    :custom-row="listToTree"
    @on-table-data-updated="dataChanged"
  >
    <el-table-column label="菜单名称" prop="name"></el-table-column>
    <el-table-column label="类型" prop="type">
      <template #default="{ row }">
        <el-button
          v-if="row.type === 0"
          cursor-default
          type="primary"
          size="small"
          >目录</el-button
        >
        <el-button
          v-if="row.type === 1"
          cursor-default
          type="success"
          size="small"
          >菜单</el-button
        >
        <el-button
          v-if="row.type === 2"
          cursor-default
          type="danger"
          size="small"
          >权限</el-button
        >
      </template>
    </el-table-column>
    <el-table-column label="图标" prop="icon">
      <template #default="{ row }">
        <i :class="`i-${row.icon}`"></i>
      </template>
    </el-table-column>
    <el-table-column label="路由" prop="router"></el-table-column>
    <el-table-column label="视图路径" prop="viewPath"></el-table-column>
    <el-table-column label="权限" prop="perms"></el-table-column>
    <el-table-column label="排序" prop="sort"></el-table-column>
    <el-table-column label="操作" fixed="right" width="140px">
      <template #default="{ row }">
        <el-button
          v-has-perm="'/sys/perm/menu/updateMenu'"
          type="primary"
          size="small"
          plain
          @click="editRow(toRaw(row))"
          >编辑</el-button
        >
        <el-button
          v-has-perm="'/sys/perm/menu/deleteMenu'"
          type="danger"
          size="small"
          plain
          @click="delRow(toRaw(row))"
          >删除</el-button
        >
      </template>
    </el-table-column>
    <template #tableHeader>
      <el-button type="primary" @click="addPerm">新增</el-button>
    </template>
  </SuperTable>
  <div v-if="dialogFormVisible">
    <el-dialog
    v-model="dialogFormVisible"
    title="编辑"
    :close-on-click-modal="false"
  >
    <SearchForm
      ref="srarchForm"
      :show-btn="false"
      :layout="FormItemLayout.column"
      :form-data="formData"
      :rules="rules"
      @on-search="updateRow"
    ></SearchForm>
    <template #footer>
      <span class="dialog-footer">
        <el-button :loading="formBtnLoading" @click="cancel">取消</el-button>
        <el-button :loading="formBtnLoading" type="primary" @click="confirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>
