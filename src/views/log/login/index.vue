<script lang="ts" setup>
import SearchForm, { FormItemType } from "@/components/SearchForm";
const formData = [
  {
    label: "文本框：",
    key: "textarea",
    type: FormItemType.textarea,
    value: "这是文本内容",
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
  textarea: [{ required: true, message: "请输入", trigger: "blur" }],
  input: [{ required: true, message: "请输入", trigger: "blur" }],
  region: [{ required: true, message: "请选择", trigger: ["blur", "change"] }],
  selectMultiple: [
    { required: true, message: "请选择", trigger: ["blur", "change"] },
  ],
  timePicker: [
    { required: true, message: "请选择", trigger: ["blur", "change"] },
  ],
  switch: [{ required: false, message: "请选择", trigger: ["blur", "change"] }],
  checkbox: [
    { required: true, message: "请选择", trigger: ["blur", "change"] },
  ],
  radio: [{ required: true, message: "请选择", trigger: ["blur", "change"] }],
  colorPicker: [
    { required: true, message: "请选择", trigger: ["blur", "change"] },
  ],
  slider: [{ required: true, message: "请选择", trigger: ["blur", "change"] }],
  rate: [{ required: true, message: "请选择", trigger: ["blur", "change"] }],
};
</script>

<template>
  <SearchForm :form-data="formData" :rules="rules"></SearchForm>
</template>
