import { FormItemType } from "@/components/SearchForm";
import { cloneDeep } from 'lodash';
import { useUserStore } from "@/store/modules/user";
import listToTree from "@/utils/listToTree"

const userStore = useUserStore()

function mapkeyValue(list: Array<any>, result: Array<any> = []) {
  list.forEach((item) => {
    item["label"] = item.name;
    item["value"] = item.id;
    if (item.children) {
      item.children = mapkeyValue(item.children, []);
    }
    result.push(item);
  });
  return result;
}
export default function useForm() {
  //类型为目录或者菜单
  const typeFold = [
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
      value: 0,
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
      type: FormItemType.treeSelect,
      value: undefined,
      opts: [],
      attrs: {
        checkStrictly: true,
        renderAfterExpand: false,
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
  ];
  //类型为权限
  const typePerms = [
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
      value: 2,
      attrs: {
        disabled: false,
        onChange: typeChanged,
      },
    },
    {
      label: "权限名称：",
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
      type: FormItemType.treeSelect,
      value: undefined,
      opts: [],
      attrs: {
        checkStrictly: true,
        renderAfterExpand: false,
      },
    },
    {
      label: "权限：",
      key: "perms",
      type: FormItemType.select,
      value: [],
      attrs: {
        multiple: true,
        collapseTags: true,
      },
      opts: getMapkey(userStore.perms),
    },
  ];

  const formData: any = ref(cloneDeep(typeFold));
  const typeValue = ref(0);

  function typeChanged(val) {
    typeValue.value = val;
  }

  function getMapkey(arr: string[]): Array<any> {
    return arr.map(item => ({
      lable: item,
      value: item
    }))
  }

  function findItemBykey(key: string) {
    return formData.value.find((item) => item.key === key);
  }

  function refreshParrentList() {
    const list = listToTree(toRaw(userStore.menus));
    //重置父级菜单选项
    findItemBykey("parentId").opts = [
      {
        label: "#",
        value: 0,
        children: mapkeyValue(list, []),
      },
    ];
  }

  async function resetFormData(type?: number) {
    if (type === 2) {
      //权限
      formData.value = cloneDeep(typePerms);
    } else {
      //菜单
      formData.value = cloneDeep(typeFold);
    }
    //每次新增菜单或者权限之前需要同步权限列表信息
    await userStore.getPermmenu();
    //刷新父级菜单
    refreshParrentList();
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
    typeValue,
    formData,
    rules,
    findItemBykey,
    resetFormData,
    getMapkey,
  };
}
