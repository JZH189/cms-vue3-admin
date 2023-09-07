import { FormItemType } from "@/components/SearchForm";
import { cloneDeep } from 'lodash';
export default function useForm() {

  const formData: any = ref([
    {
      label: "类型：",
      key: "type",
      type: FormItemType.radio,
      opts: [
        {
          label: "目录",
          value: 0,
        },
        {
          label: "菜单",
          value: 1,
        },
        {
          label: "权限",
          value: 2,
        },
      ],
      value: undefined,
      attrs: {
        disabled: false,
        onChange: typeChanged,
      },
    },
    {
      label: "菜单名称：",
      key: "name",
      type: FormItemType.input,
      value: undefined,
      attrs: {
        maxLength: "20",
        showWordLimit: true,
      },
    },
    {
      label: "父级菜单：",
      key: "parentId",
      type: FormItemType.input,
      value: undefined,
      attrs: {
        disabled: false,
      },
    },
    {
      label: "路由：",
      key: "router",
      type: FormItemType.input,
      value: undefined,
      attrs: {
        maxLength: "20",
        showWordLimit: true,
      },
    },
    {
      label: "图标：",
      key: "icon",
      type: FormItemType.input,
      value: undefined,
      prepend: "i-",
      attrs: {
        maxLength: "20",
        showWordLimit: true,
      },
    },
    {
      label: "状态：",
      key: "isShow",
      type: FormItemType.radio,
      value: 1,
      opts: [
        {
          label: "显示",
          value: 1,
        },
        {
          label: "隐藏",
          value: 0,
        },
      ],
    },
    {
      label: "排序：",
      key: "orderNum",
      type: FormItemType.input,
      value: 0,
    },
  ]);

  const typeValue = ref(0);

  function typeChanged(val) {
    typeValue.value = val;
  }
  const rawDataList: any = ref(cloneDeep(toRaw(formData.value)));

  function getMapkey(arr: string[]): Array<any> {
    return arr.map(item => ({
      lable: item,
      value: item
    }))
  }

  function findItemBykey(key: string) {
    return formData.value.find((item) => item.key === key);
  }

  const rules = reactive({
    type: [
      { required: true, message: "请选择类型", trigger: ["change", "blur"] },
    ],
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    parentId: [
      {
        required: true,
        message: "请选择父级菜单",
        trigger: ["change", "blur"],
      },
    ],
    router: [{ required: true, message: "请输入路由", trigger: "blur" }],
  });

  return {
    rawDataList,
    typeValue,
    formData,
    rules,
    findItemBykey,
    getMapkey,
  };
}
