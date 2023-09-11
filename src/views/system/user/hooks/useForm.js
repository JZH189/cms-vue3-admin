import { FormItemType } from "@/components/SearchForm";
import { cloneDeep } from 'lodash';
export async function getMenuList() {
    const result = await API.get({
        url: "/admin/sys/perm/menu/menuList",
    });
    return result.list;
}
function mapkeyValue(list, result = []) {
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
async function getSysRoleList() {
    const result = await API.get({
        url: "/admin/sys/role/roleList",
    });
    console.log(res);
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
    const rowData = reactive({
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
    const formData = ref(cloneDeep(formColunm));
    function getMapkey(arr) {
        return arr.map(item => ({
            lable: item,
            value: item
        }));
    }
    function findItemBykey(key) {
        return formData.value.find((item) => item.key === key);
    }
    async function assignFormVal(raw) {
        await getSysRoleList();
        //编辑formData.key赋值
        formData.value.map(item => item.key).forEach(key => {
            findItemBykey(key).value = raw[key];
        });
    }
    async function resetFormData() {
        formData.value = cloneDeep(formColunm);
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
        assignFormVal,
        getMapkey,
    };
}
//# sourceMappingURL=useForm.js.map