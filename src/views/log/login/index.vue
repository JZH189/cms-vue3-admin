<script lang="ts" setup>
import SearchForm from "@/components/SearchForm/index.vue";
const formData = [
  {
    label: "文本框：",
    key: "desc",
    type: "textarea",
    value: undefined,
  },
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
    opts: [
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
    label: "下拉多选框：",
    key: "region1",
    type: "multipleSelect",
    opts: [
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
    key: "activeTime1",
    type: "time-picker",
    value: undefined,
  },
  {
    label: "日期选择：",
    key: "activeTime2",
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
    opts: [
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
    opts: [
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
    label: "颜色选择：",
    key: "colorPicker",
    type: "color-picker",
    value: undefined,
  },
  {
    label: "滑块：",
    key: "slider",
    type: "slider",
    value: undefined,
  },
  {
    label: "评分：",
    key: "rate",
    type: "rate",
    value: undefined,
  },
];
</script>

<template>
  <SearchForm :form-data="formData"></SearchForm>
</template>
