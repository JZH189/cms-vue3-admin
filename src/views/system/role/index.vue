<script lang="ts" setup>
import SuperTable from "@/components/SuperTable";
import SearchForm, { FormItemLayout } from "@/components/SearchForm";
import useForm, { getMenuList, getParrentList } from "./hooks/useForm"

const { rowData, formData, findItemBykey, rules, updateRowData } = useForm()

let isEdit = ref(true)

let formBtnLoading = false;
let deleteMenuLoading = false;
const superTableRef = ref();
const dialogFormVisible = ref(false);

const srarchFormRef = ref();

function cancel() {
  srarchFormRef.value?.resetForm();
  dialogFormVisible.value = false;
  formBtnLoading = false;
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
  formBtnLoading = true;
  API.post({
    url: isEdit.value ? "/admin/sys/role/updateRole" : "/admin/sys/role/addRole",
    data: {
      ...param,
      id: isEdit.value ? rowData.id : undefined,
    },
  }).then(() => {
    ElMessage.success(`${isEdit.value ? '修改成功！' : '新增成功！'}`)
    formBtnLoading = false;
    dialogFormVisible.value = false
    superTableRef.value.doSearch();
  });
}

async function editRow(raw: any) {
  isEdit.value = true
  if (raw.roleCode === "root" && raw.permMenuIds.length <= 0) {
    const allMenus = await getMenuList()
    raw.permMenuIds = allMenus.map(item => item.id)
  }
  Object.assign(rowData, raw)
  updateRowData(raw)
  dialogFormVisible.value = true;
  //一定要在表单渲染之后才能调用
  nextTick(() => {
    setCheckedKeysVal(raw.permMenuIds)
  })
}

function addRole() {
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
  dialogFormVisible.value = true;
}

onMounted(async () => {
  const res = await getParrentList()
  findItemBykey('permMenuIds').opts = res
})
</script>

<template>
  <SuperTable
    ref="superTableRef"
    query-api="/admin/sys/role/roleList"
    no-form
    row-key="id"
  >
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="角色标识" prop="roleCode"></el-table-column>
    <el-table-column label="状态" prop="status">
      <template #default="{ row }">
        <el-switch 
          v-model="row.status" 
          :active-value="1" 
          :inactive-value="0" 
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        ></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="排序" prop="orderNum"></el-table-column>
    <el-table-column label="操作" fixed="right" width="140px">
      <template #default="{ row }">
        <el-button
          v-has-perm="'/sys/role/updateRole'"
          type="primary"
          size="small"
          plain
          @click="editRow(toRaw(row))"
          >编辑</el-button
        >
        <el-button
          v-has-perm="'/sys/role/deleteRole'"
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
  <div v-if="dialogFormVisible">
    <el-dialog
      v-model="dialogFormVisible"
      title="编辑"
      :close-on-click-modal="false"
    >
      <SearchForm
        ref="srarchFormRef"
        :show-btn="false"
        :layout="FormItemLayout.column"
        :form-data="formData"
        :rules="rules"
        @on-search="handleOpt"
      ></SearchForm>
      <template #footer>
        <span class="dialog-footer">
          <el-button :loading="formBtnLoading" @click="cancel">取消</el-button>
          <el-button :loading="formBtnLoading" type="primary" @click="confirm">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
