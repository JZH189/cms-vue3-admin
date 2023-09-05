<script lang="ts" setup>
import { reactive, ref } from "vue";
import { FormItemType, FormItemLayout } from "../enum";
import type { FormInstance, FormRules, FormItemProps } from "element-plus";

//formItem 接口
interface IformItem {
  key: string;
  label: string;
  type: FormItemType; //字段的类型
  value?: any;
  attrs?: any; //字段Attributes
  opts?: any[]; //选项值
  formItemAttrs?: FormItemProps; //表单项Attributes
}

interface Iprops {
  formData: IformItem[];
  layout?: FormItemLayout;
  showBtn?: boolean;
  labelWidth?: string | number;
  rules?: FormRules;
}

const props = withDefaults(defineProps<Iprops>(), {
  labelWidth: "120px",
  rules: undefined,
  showBtn: true,
  layout: FormItemLayout.flex, //默认表单项是响应式
});

const emit = defineEmits<{
  (e: "onSearch", value: any): void;
  (e: "onReset", value: any): void;
}>();

function needArr(item: IformItem): boolean {
  return (
    ["checkbox", "cascader"].includes(item.type) ||
    (["select", "time-picker", "date-picker"].includes(item.type) &&
      (item.attrs?.multiple ||
        item.attrs?.daterange ||
        item.attrs?.datetimerange ||
        item.attrs?.monthrange))
  );
}

const searchFormRef = ref<FormInstance>();

// 初始表单数据
let initForm = {};

//表单data对象
let form: any = reactive({});

/**
 * @param data prop.formData
 */
function initFormFields(data: any[]) {
  //初始化initForm
  data.forEach((item) => {
    Object.assign(initForm, {
      [item.key]: item.value ? item.value : needArr(item) ? [] : undefined,
    });
  });
  //初始化form
  Object.assign(form, initForm);
}

watch(
  () => props,
  ({ formData }) => {
    initFormFields(formData);
  },
  {
    immediate: true,
  }
);

const columnLayout = computed(() => props.layout === FormItemLayout.column);

/**
 * 提交表单
 */
async function submitForm() {
  if (!searchFormRef.value) return false;
  await searchFormRef.value.validate(async (valid) => {
    if (valid) {
      emit("onSearch", toRaw(form));
    }
  });
}
/**
 * 重置表单
 */
async function resetForm() {
  if (!searchFormRef.value) return false;
  searchFormRef.value.resetFields();
  //初始化form
  Object.assign(form, initForm);
  emit("onReset", toRaw(form));
}

defineExpose({
  formData: toRaw(form),
  submitForm,
  resetForm,
});
</script>

<template>
  <el-form
    ref="searchFormRef"
    :model="form"
    :rules="rules"
    :label-width="
      typeof props.labelWidth === 'string'
        ? props.labelWidth
        : `${props.labelWidth}px`
    "
  >
    <el-row :gutter="10">
      <el-col
        v-for="{
          type,
          label,
          key,
          opts,
          attrs,
          formItemAttrs,
        } in props.formData"
        :key="key"
        :xs="24"
        :sm="columnLayout ? 24 : 12"
        :md="columnLayout ? 24 : 8"
        :lg="columnLayout ? 24 : 8"
        :xl="columnLayout ? 24 : 4"
      >
        <el-form-item :label="label" :prop="key" v-bind="formItemAttrs">
          <!-- 输入框 -->
          <el-input
            v-if="type === 'input'"
            v-model.trim="form[key]"
            :clearable="!attrs?.disabled"
            v-bind="attrs"
          />
          <!-- 文本框 -->
          <el-input
            v-else-if="type === 'textarea'"
            v-model.trim="form[key]"
            type="textarea"
            v-bind="attrs"
          />
          <!-- 下拉选择框 -->
          <el-select
            v-else-if="type === 'select'"
            v-model="form[key]"
            :clearable="!attrs?.disabled"
            v-bind="attrs"
          >
            <el-option
              v-for="opt in opts"
              :key="opt.label"
              :label="opt.label"
              :value="opt.value"
            ></el-option>
          </el-select>
          <!-- 时间选择 -->
          <el-time-picker
            v-else-if="type === 'time-picker'"
            v-model="form[key]"
            :clearable="!attrs?.disabled"
            v-bind="attrs"
          ></el-time-picker>
          <!-- 下拉选择时间 -->
          <el-time-select
            v-else-if="type === 'time-select'"
            v-model="form[key]"
            :clearable="!attrs?.disabled"
            v-bind="attrs"
          ></el-time-select>
          <!-- 日期选择 -->
          <el-date-picker
            v-else-if="type === 'date-picker'"
            v-model="form[key]"
            :clearable="!attrs?.disabled"
            v-bind="attrs"
          />
          <!-- 开关 -->
          <el-switch
            v-else-if="type === 'switch'"
            v-model="form[key]"
            v-bind="attrs"
          ></el-switch>
          <!-- 复选框 -->
          <el-checkbox-group
            v-else-if="type === 'checkbox'"
            v-model="form[key]"
          >
            <el-checkbox
              v-for="checkboxItem in opts"
              :key="checkboxItem.label"
              :label="checkboxItem.label"
            />
          </el-checkbox-group>
          <!-- 单选框 -->
          <el-radio-group
            v-else-if="type === 'radio'"
            v-model="form[key]"
            v-bind="attrs"
          >
            <el-radio
              v-for="radioItem in opts"
              :key="radioItem.label"
              :label="radioItem.label"
              >{{ radioItem.label }}</el-radio
            >
          </el-radio-group>
          <!-- 颜色选择 -->
          <el-color-picker
            v-else-if="type === 'color-picker'"
            v-model="form[key]"
            v-bind="attrs"
          />
          <!-- 级联选择 -->
          <el-cascader
            v-else-if="type === 'cascader'"
            v-model="form[key]"
            :clearable="!attrs?.disabled"
            v-bind="attrs"
          />
          <!-- 滑块 -->
          <el-slider
            v-else-if="type === 'slider'"
            v-model="form[key]"
            v-bind="attrs"
          />
          <!-- 评分 -->
          <el-slider
            v-else-if="type === 'rate'"
            v-model="form[key]"
            v-bind="attrs"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="props.showBtn" :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
        <el-form-item>
          <el-button type="primary" @click="submitForm">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped>
:deep(.el-form-item__content > div) {
  width: 100%;
}
</style>
