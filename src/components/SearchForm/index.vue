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
  label: string;
  key: string;
  type: string;
  value: any;
  placeholder?: string;
  required?: boolean;
  fieldOptions?: any[];
  fieldAttributes?: any; //字段Attributes
  formItemProps?: FormItemProps; //表单项Props
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

interface RuleForm {
  name: string;
  region: string;
  region1: string[];
  activeTime: string;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
}

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "Hello",
  region: "",
  region1: [],
  activeTime: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  region: [
    {
      required: true,
      message: "Please select Activity zone",
      trigger: "change",
    },
  ],
  region1: [
    {
      required: true,
      message: "Please select Activity zone",
      trigger: "change",
    },
  ],
  activeTime: [
    {
      required: true,
      message: "Please pick a time",
      trigger: "change",
    },
  ],
  type: [
    {
      type: "array",
      required: true,
      message: "Please select at least one activity type",
      trigger: "change",
    },
  ],
  resource: [
    {
      required: true,
      message: "Please select activity resource",
      trigger: "change",
    },
  ],
  desc: [
    { required: true, message: "Please input activity form", trigger: "blur" },
  ],
});

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

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}));
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item
      v-for="{
        type,
        label,
        key,
        fieldOptions,
        fieldAttributes,
        formItemProps,
        required,
        placeholder,
      } in prop.formData"
      :key="key"
      :label="label"
      :prop="key"
      v-bind="formItemProps"
    >
      <!-- 输入框 -->
      <el-input
        v-if="type === 'input'"
        v-model="ruleForm.key"
        :clearable="!required"
        :placeholder="placeholder"
        v-bind="fieldAttributes"
      />
      <!-- 文本框 -->
      <el-input
        v-if="type === 'textarea'"
        v-model="ruleForm.key"
        :placeholder="placeholder"
        v-bind="fieldAttributes"
      />
      <!-- 下拉单选框 -->
      <el-select
        v-else-if="type === 'select'"
        v-model="ruleForm.key"
        :options="fieldOptions"
        :clearable="!required"
        :placeholder="placeholder"
        v-bind="fieldAttributes"
      ></el-select>
      <!-- 下拉多选框 -->
      <el-select
        v-else-if="type === 'multipleSelect'"
        v-model="ruleForm.key"
        :options="fieldOptions"
        :clearable="!required"
        :placeholder="placeholder"
        v-bind="fieldAttributes"
      ></el-select>
    </el-form-item>
    <!-- <el-form-item label="Activity name" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="Activity zone" prop="region">
      <el-select v-model="ruleForm.region" placeholder="Activity zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="Activity zone1" prop="region1">
      <el-select
        v-model="ruleForm.region1"
        multiple
        collapse-tags
        placeholder="Activity zone"
      >
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="Activity time" required>
      <el-date-picker
        v-model="ruleForm.activeTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        placeholder="Select date and time"
      />
    </el-form-item>
    <el-form-item label="Instant delivery" prop="delivery">
      <el-switch v-model="ruleForm.delivery" />
    </el-form-item>
    <el-form-item label="Activity type" prop="type">
      <el-checkbox-group v-model="ruleForm.type">
        <el-checkbox label="Online activities" name="type" />
        <el-checkbox label="Promotion activities" name="type" />
        <el-checkbox label="Offline activities" name="type" />
        <el-checkbox label="Simple brand exposure" name="type" />
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources" prop="resource">
      <el-radio-group v-model="ruleForm.resource">
        <el-radio label="Sponsorship" />
        <el-radio label="Venue" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Activity form" prop="desc">
      <el-input v-model="ruleForm.desc" type="textarea" />
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"
        >搜索</el-button
      >
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
