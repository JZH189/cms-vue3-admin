<script lang="ts" setup>
import SuperTable from "@/components/SuperTable";
import SearchForm, { FormItemLayout } from "@/components/SearchForm";
import useForm, { getMenuList } from "./hooks/useForm"

const { rowData, searchForm, formData, rules, updateRowData, resetFormData } = useForm()

let isEdit = ref(true)

const dialogData = reactive({
  visiabel: false,
  title: '编辑',
  btnLoading: false,
})

let deleteRoleLoading = false;
const superTableRef = ref();
const srarchFormRef = ref();

function cancel() {
  srarchFormRef.value?.resetForm();
  dialogData.btnLoading = false
  dialogData.visiabel = false
}

function confirm() {
  srarchFormRef.value?.submitForm();
}

function delRow(raw: any) {
  ElMessageBox.confirm("确定删除此记录？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    deleteRoleLoading = true;
    await API.post({
      url: "/admin/sys/role/deleteRole",
      data: {
        id: raw.id,
      },
    })
      .then(() => {
        ElMessage.success('删除成功！')
      })
      .finally(() => {
        deleteRoleLoading = false;
        superTableRef.value.doSearch();
    });
  });
}

//获取选中的权限id
function getCheckedKeysVal() {
  return srarchFormRef.value.getCheckedKeys()
}

function setCheckedKeysVal(ids: number[]) {
  srarchFormRef.value.setCheckedKeys(ids)
}

function handleOpt(val) {
  const param = {
    ...val,
    permMenuIds: getCheckedKeysVal()
  }
  dialogData.btnLoading = true
  API.post({
    url: isEdit.value ? "/admin/sys/user/updateUser" : "/admin/sys/user/deleteUser",
    data: {
      ...param,
      id: isEdit.value ? rowData.id : undefined,
    },
  }).then(() => {
    ElMessage.success(`${isEdit.value ? '修改成功！' : '新增成功！'}`)
    superTableRef.value.doSearch();
  }).finally(() => {
    dialogData.visiabel = false
    dialogData.btnLoading = false
  })
}

async function editRow(raw: any) {
  dialogData.title = '编辑'
  resetFormData()
  isEdit.value = true
  if (raw.roleCode === "root" && raw.permMenuIds.length <= 0) {
    const allMenus = await getMenuList()
    raw.permMenuIds = allMenus.map(item => item.id)
  }
  Object.assign(rowData, raw)
  updateRowData(raw)
  dialogData.visiabel = true
  //一定要在表单渲染之后才能调用
  nextTick(() => {
    setCheckedKeysVal(raw.permMenuIds)
  })
}

function addRole() {
  dialogData.title = '新增'
  resetFormData()
  isEdit.value = false
  Object.assign(rowData, {
    id: undefined,
    icon: undefined,
    isShow: undefined,
    name: undefined,
    orderNum: undefined,
    perms: [],
    router: undefined,
    type: 0,
  });
  dialogData.visiabel = true
}
</script>

<template>
  <SuperTable
    ref="superTableRef"
    :form-data="searchForm"
    query-api="/admin/sys/user/userPage"
  >
    <el-table-column label="账号" prop="account"></el-table-column>
    <el-table-column label="用户昵称" prop="userName"></el-table-column>
    <el-table-column label="手机号" prop="mobile"></el-table-column>
    <el-table-column label="角色集" prop="roleIds"></el-table-column>
    <el-table-column label="状态" prop="status">
      <template #default="{ row }">
        <el-switch 
          v-model="row.status"
          disabled
          :active-value="1"
          :inactive-value="0"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        ></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="备注信息" prop="remark"></el-table-column>
    <el-table-column label="操作" fixed="right" width="140px">
      <template #default="{ row }">
        <el-button
          v-has-perm="'/sys/user/updateUser'"
          type="primary"
          size="small"
          plain
          @click="editRow(toRaw(row))"
          >编辑</el-button
        >
        <el-button
          v-has-perm="'/sys/user/deleteUser'"
          type="danger"
          size="small"
          plain
          @click="delRow(toRaw(row))"
          >删除</el-button
        >
      </template>
    </el-table-column>
    <template #tableHeader>
      <el-button type="primary" @click="addRole">新增</el-button>
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
