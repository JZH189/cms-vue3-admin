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

export async function getParrentList() {
  const menuList = await getMenuList();
  const list = listToTree(menuList);
  return mapkeyValue(list, []);
}

export default function useForm() {

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
      label: "角色名称：",
      key: "roleName",
      type: FormItemType.input,
      value: undefined,
      attrs: {
        maxLength: "50",
        showWordLimit: true,
      },
    },
    {
      label: "角色标识：",
      key: "roleCode",
      type: FormItemType.input,
      value: undefined,
      attrs: {
        maxLength: "50",
        showWordLimit: true,
      },
    },
    {
      label: "分配权限：",
      key: "permMenuIds",
      type: FormItemType.tree,
      value: [],
      opts: [],
      attrs: {
        showCheckbox: true, //显示复选框
        nodeKey: "value",
        accordion: true, //手风琴模式
        //defaultCheckedKeys: [5],
      },
    },
    {
      label: "排序：",
      key: "orderNum",
      type: FormItemType.input,
      value: 0,
    },
    {
      label: "状态：",
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

  function resetFormData() {
    formData.value = cloneDeep(formColunm);
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
    formData,
    rules,
    findItemBykey,
    resetFormData,
    getMapkey,
    updateRowData,
  };
}
