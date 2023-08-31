import { createApp } from "vue";
import "@/router/permission";

// 本地SVG图标
import "virtual:svg-icons-register";
// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import "uno.css";
import App from "./App.vue";
import router from "@/router";
import { setupStore } from "@/store";
import { setupDirective } from "@/directive";
import { setGlobalOptions } from "vue-request";

//vue-request 全局配置
setGlobalOptions({
  manual: true,
  pagination: {
    currentKey: "currentPage", //当前页数
    pageSizeKey: "pageSize", //每页获取条数
    totalKey: "pagination.total", //指定 data 中 total 属性的路径
  },
});

const app = createApp(App);
// 全局注册 自定义指令(directive)
setupDirective(app);
// 全局注册 状态管理(store)
setupStore(app);

app.use(router).mount("#app");
