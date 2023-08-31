import { defineStore } from "pinia";
import defaultSettings from "@/settings";
import { useStorage } from "@vueuse/core";

export const useSettingsStore = defineStore("setting", () => {
  // state
  const tagsView = useStorage<boolean>("tagsView", defaultSettings.tagsView);
  const showDrawer = ref<boolean>(false);
  const showSettings = ref<boolean>(defaultSettings.showSettings);
  const fixedHeader = ref<boolean>(defaultSettings.fixedHeader);
  const sidebarLogo = ref<boolean>(defaultSettings.sidebarLogo);

  const layout = useStorage<string>("layout", defaultSettings.layout);

  // actions
  function changeSetting(param: { key: string; value: any }) {
    const { key, value } = param;
    switch (key) {
      case "showSettings":
        showSettings.value = value;
        break;
      case "fixedHeader":
        fixedHeader.value = value;
        break;
      case "tagsView":
        tagsView.value = value;
        break;
      case "sidevarLogo":
        sidebarLogo.value = value;
        break;
      case "layout":
        layout.value = value;
        break;
      case "showDrawer":
        showDrawer.value = value;
        break;
      default:
        break;
    }
  }

  return {
    showSettings,
    tagsView,
    showDrawer,
    fixedHeader,
    sidebarLogo,
    layout,
    changeSetting,
  };
});
