<script lang="ts" setup>
import SuperTable from "@/components/SuperTable";
import listToTree from "@/utils/listToTree"
import { hasPermission } from "@/utils/hasPermission"

const res = hasPermission("/sys/perm/menu/updateMenu")
console.log('res: ', res);

</script>

<template>
  <SuperTable
    query-api="/admin/sys/perm/menu/menuList"
    no-form
    row-key="id"
    :custom-row="listToTree"
  >
    <el-table-column label="菜单名称" prop="name"></el-table-column>
    <el-table-column label="类型" prop="type">
      <template #default="{row}">
        <el-button v-if="row.type === 0" type="primary" size="small">目录</el-button>
        <el-button v-if="row.type === 1" type="success" size="small">菜单</el-button>
        <el-button v-if="row.type === 2" type="danger" size="small">权限</el-button>
      </template>
    </el-table-column>
    <el-table-column label="图标" prop="icon">
      <template #default="{row}">
        <i :class="`i-${row.icon}`"></i>
      </template>
    </el-table-column>
    <el-table-column label="路由" prop="router"></el-table-column>
    <el-table-column label="视图路径" prop="viewPath"></el-table-column>
    <el-table-column label="权限" prop="perms"></el-table-column>
    <el-table-column label="排序" prop="sort"></el-table-column>
    <el-table-column label="操作" fixed="right" width="140px">
      <template #default="{row}">
        <el-button type="primary" size="small" plain>编辑</el-button>
        <el-button type="danger" size="small" plain>删除</el-button>
      </template>
    </el-table-column>
  </SuperTable>
</template>
