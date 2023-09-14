import { FormItemType } from "@/components/SearchForm";
import { cloneDeep } from 'lodash';
import { validatePhone } from "@/utils/validate"

export async function getSysRoleList(): Promise<any[]> {
  try {
    const result = await API.get<ListResult<any>>({
      url: "/admin/sys/role/roleList",
    });
    return result.list.map(item => ({
      label: item.roleName,
      value: item.id
    }))
  } catch (error) {
    console.log('error: ', error);
    return []
  }
}

export default function useForm() {

  const searchForm = ref([
    {
      label: "用户昵称：",
      key: "userName",
      type: FormItemType.input,
      value: undefined,
      attrs: {
        maxlength: "50",
        showWordLimit: true,
      },
    },
  ]);

  const rowData: any = reactive({
    id: undefined,
    account: undefined,
    userName: undefined,
    mobile: undefined,
    roleIds: [],
    status: 1,
  });

  const formColunm = [
    {
      label: "账号(用于登录)：",
      key: "account",
      type: FormItemType.input,
      value: undefined,
      attrs: {
        maxlength: "50",
        showWordLimit: true,
      },
    },
    {
      label: "用户昵称(用于系统显示)：",
      key: "userName",
      type: FormItemType.input,
      value: undefined,
      attrs: {
        maxlength: "50",
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
        maxlength: "11",
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
        maxlength: "200",
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

  async function resetRolesList() {
    const roleList = await getSysRoleList();
    //设置权限列表数据
    findItemBykey("roleIds").opts = roleList;
  }

  async function assignFormVal(raw: any) {
    //编辑formData.key赋值
    formData.value.map(item => item.key).forEach(key => {
      findItemBykey(key).value = raw[key];
    })
    Object.keys(rowData).forEach(key => {
      rowData[key] = raw[key]
    });
    resetRolesList()
  }

  async function resetFormData() {
    formData.value = cloneDeep(formColunm);
    resetRolesList();
  }

  const rules = reactive({
    account: [{ required: true, message: "请输入登录名称", trigger: "blur" }],
    userName: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
    mobile: [
      {
        required: true,
        trigger: "blur",
        validator: validatePhone,
      },
    ],
    roleIds: [
      { required: true, message: "请选择角色", trigger: ["blur", "change"] },
    ],
  });

  return {
    rowData,
    searchForm,
    formData,
    rules,
    findItemBykey,
    resetFormData,
    assignFormVal,
    getMapkey,
  };
}
