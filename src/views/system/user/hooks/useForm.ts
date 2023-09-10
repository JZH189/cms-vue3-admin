import { FormItemType } from "@/components/SearchForm";
import { cloneDeep } from 'lodash';
import listToTree from "@/utils/listToTree"

export async function getMenuList() {
  const result = await API.get({
    url: "/admin/sys/perm/menu/menuList",
  });
  return result.list;
}

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

async function getParrentList() {
  const menuList = await getMenuList();
  const list = listToTree(menuList);
  return mapkeyValue(list, []);
}

export default function useForm() {

  const searchForm = ref([
    {
      label: "用户昵称：",
      key: "userName",
      type: FormItemType.input,
      value: undefined,
      attrs: {
        maxLength: "50",
        showWordLimit: true,
      },
    },
  ]);

  const rowData: any = reactive({
    id: undefined,
    orderNum: 0,
    permMenuIds: [],
    roleName: undefined,
    roleCode: undefined,
    status: 1,
  });

  //类型为权限
  const formColunm = [
    {
      label: "账号(用于登录)：",
      key: "account",
      type: FormItemType.input,
      value: undefined,
      attrs: {
        maxLength: "50",
        showWordLimit: true,
      },
    },
    {
      label: "用户昵称(用于系统显示)：",
      key: "userName",
      type: FormItemType.input,
      value: undefined,
      attrs: {
        maxLength: "50",
        showWordLimit: true,
      },
    },
    {
      label: "账号状态：",
      key: "status",
      type: FormItemType.radio,
      value: 1,
      opts: [
        {
          label: "启用",
          value: 1,
        },
        {
          label: "禁用",
          value: 0,
        },
      ],
    },
    {
      label: "手机号：",
      key: "mobile",
      type: FormItemType.input,
      value: undefined,
      attrs: {
        maxLength: "11",
        showWordLimit: true,
      },
    },
    {
      label: "角色集：",
      key: "roleIds",
      type: FormItemType.select,
      value: [],
      attrs: {
        multiple: true,
        collapseTags: true,
      },
      opts: [],
    },
    {
      label: "备注信息：",
      key: "remark",
      type: FormItemType.textarea,
      value: undefined,
      attrs: {
        maxLength: "200",
        showWordLimit: true,
      },
    },
  ];

  const formData: any = ref(cloneDeep(formColunm));

  function getMapkey(arr: string[]): Array<any> {
    return arr.map(item => ({
      lable: item,
      value: item
    }))
  }

  function findItemBykey(key: string) {
    return formData.value.find((item) => item.key === key);
  }

  async function resetFormData() {
    formData.value = cloneDeep(formColunm);
    findItemBykey("permMenuIds").opts = await getParrentList();
  }

  function updateRowData(row: any) {
    findItemBykey("roleName").value = row?.roleName
    findItemBykey("roleCode").value = row?.roleCode;
    findItemBykey("permMenuIds").value = row?.permMenuIds;
    findItemBykey("orderNum").value = row?.orderNum || 0;
    findItemBykey("status").value = row?.status || 0;
  }

  const rules = reactive({
    roleName: [{ required: true, message: "请角色名称", trigger: "blur" }],
    roleCode: [{ required: true, message: "请角色code", trigger: "blur" }],
  });

  return {
    rowData,
    searchForm,
    formData,
    rules,
    findItemBykey,
    resetFormData,
    getMapkey,
    updateRowData,
  };
}
