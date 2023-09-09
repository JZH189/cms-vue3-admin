<script lang="ts" setup>
import SuperTable from "@/components/SuperTable";
import listToTree from "@/utils/listToTree";
import SearchForm, { FormItemLayout } from "@/components/SearchForm";
import { useUserStore } from "@/store/modules/user";
import CommonDialog from "@/components/CommonDialog/index.vue"
import useForm from "./hooks/useForm";

const { menus } = useUserStore();

const dialogData = reactive({
  visiabel: false,
  title: '编辑',
  btnLoading: false,
})

const { typeValue, formData, rules, findItemBykey, resetFormData } = useForm();

let isEdit = ref(true)

const rowData: any = reactive({
  id: undefined,
  icon: undefined,
  isShow: 1,
  name: undefined,
  orderNum: undefined,
  parentId: undefined,
  perms: [],
  router: undefined,
  type: 0,
});

//侦听类型切换并重置表单信息
watchEffect(() => {
  if (isEdit.value) return
  resetFormData(typeValue.value)
});

let deleteMenuLoading = false;
const superTableRef = ref();

const srarchFormRef = ref();

function cancel() {
  srarchFormRef.value?.resetForm();
  dialogData.visiabel = false
  dialogData.btnLoading = false
}

function confirm() {
  srarchFormRef.value?.submitForm();
}

let tableData: any = [];

function dataChanged(val) {
  tableData = val;
}

function delRow(raw: any) {
  ElMessageBox.confirm("确定删除此记录？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    deleteMenuLoading = true;
    await API.post({
      url: "/admin/sys/perm/menu/deleteMenu",
      data: {
        id: raw.id,
      },
    })
      .then(() => {
        ElMessage.success('删除成功！')
      })
      .finally(() => {
      deleteMenuLoading = false;
      superTableRef.value.doSearch();
    });
  });
}

function handleOpt(val) {
  dialogData.btnLoading = true
  API.post({
    url: isEdit.value ? "/admin/sys/perm/menu/updateMenu" : "/admin/sys/perm/menu/addMenu",
    data: {
      ...val,
      id: isEdit.value ? rowData.id : undefined,
    },
  })
    .then(() => {
      ElMessage.success(`${isEdit.value ? '修改成功！' : '新增成功！'}`)
      dialogData.visiabel = false
      superTableRef.value.doSearch();
    })
    .finally(() => {
      dialogData.btnLoading = false
    })
}

function editName(raw: any) {
  //类型不让编辑
  findItemBykey("type").attrs.disabled = true;
  if (raw.type === 2) {
    findItemBykey("name").label = "权限名称";
    findItemBykey("parentId").attrs.disabled = true;
  } else if (raw.type === 0) {
    findItemBykey("name").label = "目录名称";
  } else if (raw.type === 1) {
    findItemBykey("name").label = "菜单名称";
  }
  if (raw.type !== 2) {
    //父级菜单不让修改
    findItemBykey("parentId").attrs.disabled = false;
  }
}

function editRow(raw: any) {
  dialogData.title = '编辑'
  //重置表单
  resetFormData(raw.type)
  isEdit.value = true
  editName(raw)
  Object.assign(rowData, raw);
  formData.value.forEach((item) => {
    if (item.key === "parentId") {
      if (raw.type === 2) {
        //权限
        const parentName = menus.find((item) => item.id === raw.parentId);
        if (parentName) {
          item.value = parentName.name;
        }
      } else {
        //目录或者菜单
        const rawParentId = raw[item.key];
        const current = tableData.find((item) => item.id === rawParentId);
        if (current) {
          item.value = current["name"];
        } else {
          item.value = 0;
        }
      }
    } else {
      item.value = raw[item.key];
    }
  });
  dialogData.visiabel = true;
}

function addPerm() {
  dialogData.title = '新增'
  isEdit.value = false
  Object.assign(rowData, {
    id: undefined,
    icon: undefined,
    isShow: undefined,
    name: undefined,
    orderNum: undefined,
    parentId: undefined,
    perms: [],
    router: undefined,
    type: 0,
  });
  resetFormData()
  dialogData.visiabel = true
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
  <CommonDialog 
    v-model:visiabel="dialogData.visiabel" 
    :btn-loading="dialogData.btnLoading"
    :title="dialogData.title"
    @cancel="cancel"
    @confirm="confirm"
    >
    <SearchForm
      ref="srarchFormRef"
      :show-btn="false"
      :layout="FormItemLayout.column"
      :form-data="formData"
      :rules="rules"
      @on-search="handleOpt"
    ></SearchForm>
  </CommonDialog>
</template>
