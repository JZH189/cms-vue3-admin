export default [
  {
    url: "/api/permmenu",
    method: "get",
    response: () => {
      return {
        data: {
          menus: [
            {
              activeRouter: "",
              icon: "carbon:settings",
              id: 1,
              isShow: 1,
              name: "系统管理",
              orderNum: 0,
              parentId: 0,
              router: "/sys",
              type: 0,
              viewPath: "",
            },
            {
              activeRouter: "",
              icon: "",
              id: 2,
              isShow: 1,
              name: "菜单管理",
              orderNum: 0,
              parentId: 1,
              router: "/sys/menu",
              type: 1,
              viewPath: "views/system/menu",
            },
            {
              activeRouter: "",
              icon: "",
              id: 7,
              isShow: 1,
              name: "角色管理",
              orderNum: 0,
              parentId: 1,
              router: "/sys/role",
              type: 1,
              viewPath: "views/system/role",
            },
            {
              activeRouter: "",
              icon: "",
              id: 12,
              isShow: 1,
              name: "系统用户",
              orderNum: 0,
              parentId: 1,
              router: "/sys/user",
              type: 1,
              viewPath: "views/system/user",
            },
            {
              activeRouter: "",
              icon: "ic:baseline-history",
              id: 18,
              isShow: 1,
              name: "日志管理",
              orderNum: 0,
              parentId: 0,
              router: "/log",
              type: 0,
              viewPath: "",
            },
            {
              activeRouter: "",
              icon: "",
              id: 19,
              isShow: 1,
              name: "登录日志",
              orderNum: 0,
              parentId: 18,
              router: "/log/login",
              type: 1,
              viewPath: "views/log/login",
            },
          ],
          perms: [
            "/sys/perm/menu/menuList",
            "/sys/perm/menu/addMenu",
            "/sys/perm/menu/deleteMenu",
            "/sys/perm/menu/updateMenu",
            "/sys/role/roleList",
            "/sys/perm/menu/list",
            "/sys/role/addRole",
            "/sys/role/deleteRole",
            "/sys/role/updateRole",
            "/sys/user/userPage",
            "/sys/store/list",
            "/sys/user/addUser",
            "/sys/user/rdpj/info",
            "/sys/user/deleteUser",
            "/sys/user/updateUser",
            "/sys/user/password/updatePassword",
            "/log/login/loginPage",
          ],
        },
        code: 200,
        msg: "success",
      };
    },
  },
];
