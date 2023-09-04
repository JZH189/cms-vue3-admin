<script lang="ts" setup>
import SuperTable, { FormItemType } from "@/components/SuperTable";

const formData = [
  {
    label: "菜单或权限名称：",
    key: "name",
    type: FormItemType.input,
    value: undefined,
  },
];

function customRow(data) {
  //type 0=目录 1=菜单 2=权限
  const level1 = data.map((item) => {
    if (item.type === 0) {
      return {
        ...item,
        children: [],
      };
    }
  });
  const level2 = data.filter((item) => {
    if (item.type === 1) {
      return {
        ...item,
        children: [],
      };
    }
  });
  const level3 = data.filter((item) => item.type === 2);
  level1.forEach((element) => {
    // if()//todo
  });
}
</script>

<template>
  <SuperTable
    query-api="/admin/sys/perm/menu/menuList"
    :form-data="formData"
    :label-width="125"
    :custom-row="customRow"
  >
    <el-table-column label="菜单名称" prop="userId"></el-table-column>
    <el-table-column label="类型" prop="ip"></el-table-column>
    <el-table-column label="图标" prop="ip"></el-table-column>
    <el-table-column label="路由" prop="ip"></el-table-column>
    <el-table-column label="视图路径" prop="ip"></el-table-column>
    <el-table-column label="权限" prop="ip"></el-table-column>
    <el-table-column label="排序" prop="sort"></el-table-column>>
  </SuperTable>
</template>
