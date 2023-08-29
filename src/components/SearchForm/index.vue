<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules, FormItemProps } from "element-plus";
//所有被支持的表单类型的枚举
enum FormItemType {
  input = "input", //输入框
  textarea = "textarea", //文本框
  select = "select", //下拉单选框
  multipleSelect = "multipleSelect", //下拉多选框
  timePicker = "time-picker", //时间选择
  timeSelect = "time-select", //时间下拉框
  datePicker = "date-picker", //日期选择
  switch = "switch", //开关
  checkbox = "checkbox", //复选框
  radio = "radio", //单选按钮
  colorPicker = "color-picker", //颜色选择
  cascader = "cascader", //级联选择
  slider = "slider", //滑块
  rate = "rate", //评分
}
//formItem 接口
interface IformItem {
  key: string;
  label: string;
  type: FormItemType;
  value?: any;
  attrs?: any; //字段Attributes
  opts?: any[]; //选项值
  formItemAttrs?: FormItemProps; //表单项Attrs
}

interface Iprops {
  formData: IformItem[];
}

const prop = defineProps<Iprops>();

const emit = defineEmits<{
  (e: "onSearch", value: any): void;
  (e: "onReset", value: any): void;
  (e: "onItemChang", value: any): void;
}>();

watch(
  () => prop,
  (val) => {
    console.log(val);
  },
  {
    immediate: true
  }
)
const ruleForm: any = reactive({})
const ruleFormRef = ref<FormInstance>();
const submitForm = async (formEl: FormInstance | undefined) => {
  console.log("form:", JSON.stringify(ruleForm));
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
  >
    <el-form-item
      v-for="{
        type,
        label,
        key,
        opts,
        attrs,
        formItemAttrs,
      } in prop.formData"
      :key="key"
      :label="label"
      :prop="key"
      v-bind="formItemAttrs"
    >
      <!-- 输入框 -->
      <el-input
        v-if="type === 'input'"
        v-model.trim="ruleForm[key]"
        v-bind="attrs"
      />
      <!-- 文本框 -->
      <el-input
        v-else-if="type === 'textarea'"
        v-model.trim="ruleForm[key]"
        v-bind="attrs"
      />
      <!-- 下拉选择框 -->
      <el-select
        v-else-if="['multipleSelect', 'select'].includes(type)"
        v-model="ruleForm[key]"
        v-bind="attrs"
        :multiple="type === 'multipleSelect'"
        :collapse-tags="type === 'multipleSelect'"
      >
        <el-option v-for="opt in opts" :key="opt.label" :label="opt.label" :value="opt.value"></el-option>
      </el-select>
      <!-- 时间选择 -->
      <el-time-picker
        v-else-if="type === 'time-picker'"
        v-model="ruleForm[key]"
        v-bind="attrs"
      ></el-time-picker>
      <!-- 下拉选择时间 -->
      <el-time-select
        v-else-if="type === 'time-select'"
        v-model="ruleForm[key]"
        v-bind="attrs"
      ></el-time-select>
      <!-- 日期选择 -->
      <el-date-picker
        v-else-if="type === 'date-picker'"
        v-model="ruleForm[key]"
        v-bind="attrs"
      />
      <!-- 开关 -->
      <el-switch
        v-else-if="type === 'switch'"
        v-model="ruleForm[key]" 
        v-bind="attrs"
      ></el-switch>
      <!-- 复选框 -->
      <el-checkbox-group v-else-if="type === 'checkbox'" v-model="ruleForm[key]">
        <el-checkbox v-for="checkboxItem in opts" :key="checkboxItem.label" :label="checkboxItem.label" />
      </el-checkbox-group>
      <!-- 单选框 -->
      <el-radio-group v-else-if="type === 'radio'" v-model="ruleForm[key]" v-bind="attrs">
        <el-radio v-for="radioItem in opts" :key="radioItem.label" :label="radioItem.label">{{ radioItem.label }}</el-radio>
      </el-radio-group>
      <!-- 颜色选择 -->
      <el-color-picker v-else-if="type === 'color-picker'" v-model="ruleForm[key]" v-bind="attrs" />
      <!-- 级联选择 -->
      <el-cascader v-else-if="type === 'cascader'" v-model="ruleForm[key]" v-bind="attrs" />
      <!-- 滑块 -->
      <el-slider v-else-if="type === 'slider'" v-model="ruleForm[key]" v-bind="attrs" />
      <!-- 评分 -->
      <el-slider v-else-if="type === 'rate'" v-model="ruleForm[key]" v-bind="attrs" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"
        >搜索</el-button
      >
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
