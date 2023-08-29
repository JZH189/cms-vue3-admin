<script lang="ts" setup>
import SearchForm from "@/components/SearchForm/index.vue";
const formData = [
  {
    label: "输入框：",
    key: "name",
    type: "input",
    value: undefined,
  },
  {
    label: "下拉单选框：",
    key: "region",
    type: "select",
    options: [
      {
        label: "Zone one",
        value: "shanghai",
      },
      {
        label: "Zone two",
        value: "beijing",
      },
    ],
    value: undefined,
  },
  {
    label: "多选框：",
    key: "region1",
    type: "multipleSelect",
    options: [
      {
        label: "Zone one",
        value: "shanghai",
      },
      {
        label: "Zone two",
        value: "beijing",
      },
    ],
    value: undefined,
  },
  {
    label: "时间选择：",
    key: "activeTime",
    type: "date-picker",
    value: undefined,
  },
  {
    label: "开关切换：",
    key: "delivery",
    type: "switch",
    value: undefined,
  },
  {
    label: "复选框：",
    key: "type",
    type: "checkbox",
    options: [
      {
        label: "Zone one",
        value: "shanghai",
      },
      {
        label: "Zone two",
        value: "beijing",
      },
    ],
    value: undefined,
  },
  {
    label: "单选框：",
    key: "resource",
    type: "radio",
    options: [
      {
        label: "Zone one",
        value: "shanghai",
      },
      {
        label: "Zone two",
        value: "beijing",
      },
    ],
    value: undefined,
  },
  {
    label: "文本框：",
    key: "desc",
    type: "textarea",
    value: undefined,
  },
];
</script>

<template>
  <SearchForm></SearchForm>
</template>
