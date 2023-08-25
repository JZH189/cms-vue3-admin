import type { App } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const store = createPinia();
// 全局注册 store
export function setupStore(app: App<Element>) {
  //使用本地持久化
  store.use(piniaPluginPersistedstate);
  app.use(store);
}

export { store };
