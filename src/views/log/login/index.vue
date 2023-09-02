<script lang="ts" setup>
import SuperTable, { FormItemType } from "@/components/SuperTable"
const formData = [
  {
    label: "文本框：",
    key: "textarea",
    type: FormItemType.textarea,
    value: "这是文本内容",
    attrs: {
      showWordLimit: true,
      maxlength: 30,
    },
  },
  {
    label: "输入框：",
    key: "input",
    type: FormItemType.input,
    value: "undefined",
  },
  {
    label: "下拉单选框：",
    key: "region",
    type: FormItemType.select,
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
    key: "selectMultiple",
    type: FormItemType.select,
    attrs: {
      multiple: true,
      collapseTags: true,
    },
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
    key: "timePicker",
    type: FormItemType.timePicker,
    value: undefined,
  },
  {
    label: "日期选择：",
    key: "datePicker",
    type: FormItemType.datePicker,
    value: undefined,
    attrs: {
      type: "daterange",
      valueFormat: "YYYY-MM-DD",
    },
  },
  {
    label: "开关切换：",
    key: "switch",
    type: FormItemType.switch,
    value: true,
  },
  {
    label: "复选框：",
    key: "checkbox",
    type: FormItemType.checkbox,
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
    key: "radio",
    type: FormItemType.radio,
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
    type: FormItemType.colorPicker,
    value: undefined,
  },
  {
    label: "滑块：",
    key: "slider",
    type: FormItemType.slider,
    value: undefined,
  },
  {
    label: "评分：",
    key: "rate",
    type: FormItemType.rate,
    value: undefined,
  },
];
const rules = {
  textarea: [{ required: false, message: "请输入", trigger: "blur" }],
  input: [{ required: false, message: "请输入", trigger: "blur" }],
  region: [{ required: false, message: "请选择", trigger: ["blur", "change"] }],
  selectMultiple: [
    { required: false, message: "请选择", trigger: ["blur", "change"] },
  ],
  timePicker: [
    { required: false, message: "请选择", trigger: ["blur", "change"] },
  ],
  switch: [{ required: false, message: "请选择", trigger: ["blur", "change"] }],
  checkbox: [
    { required: false, message: "请选择", trigger: ["blur", "change"] },
  ],
  radio: [{ required: false, message: "请选择", trigger: ["blur", "change"] }],
  colorPicker: [
    { required: false, message: "请选择", trigger: ["blur", "change"] },
  ],
  slider: [{ required: false, message: "请选择", trigger: ["blur", "change"] }],
  rate: [{ required: false, message: "请选择", trigger: ["blur", "change"] }],
};
</script>

<template>
  <SuperTable 
    query-api="/admin/log/login/loginPage"
    :form-data="formData"
    :form-rules="rules"
    >
    <el-table-column label="用户ID" prop="userId"></el-table-column>
    <el-table-column label="登录ip" prop="ip"></el-table-column>
    <el-table-column label="日志类型">
      <template #default="{row}">{{ row.type === 1 ? '登录日志' : '操作日志' }}</template>
    </el-table-column>
    <el-table-column label="状态">
      <template #default="{row}">{{ row.status === 1 ? '成功' : '失败' }}</template>
    </el-table-column>
  </SuperTable>
</template>
