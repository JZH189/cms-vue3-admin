<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/modules/app";
import { useTagsViewStore } from "@/store/modules/tagsView";
import { useUserStore } from "@/store/modules/user";
import { resetRouter } from "@/router";
import { useSettingsStore } from "@/store/modules/settings";

const settingsStore = useSettingsStore();

const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
const userStore = useUserStore();
const router = useRouter();
const { device } = storeToRefs(appStore); // 设备类型：desktop-宽屏设备 || mobile-窄屏设备

/**
 * 左侧菜单栏显示/隐藏
 */
function toggleSideBar() {
  appStore.toggleSidebar(true);
}

/**
 * vueUse 全屏
 */
const { isFullscreen, toggle } = useFullscreen();

/**
 * 退出登录
 */
function logout() {
  ElMessageBox.confirm("确定退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .catch(() => {
        resetRouter();
        userStore.resetToken();
        router.replace(`/login`);
      });
  });
}

function showSidebar() {
  settingsStore.changeSetting({ key: "showDrawer", value: true });
}
</script>

<template>
  <!-- 顶部导航栏 -->
  <div class="navbar">
    <!-- 左侧面包屑 -->
    <div class="flex">
      <hamburger
        :is-active="appStore.sidebar.opened"
        @toggle-click="toggleSideBar"
      />
      <breadcrumb />
    </div>

    <!-- 右侧导航设置 -->
    <div class="flex" f-c>
      <!-- 导航栏设置(窄屏隐藏)-->
      <div v-if="device !== 'mobile'" class="setting-container">
        <!--全屏 -->
        <div class="setting-item" @click="toggle">
          <svg-icon
            :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
          />
        </div>
        <!-- 布局大小 -->
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select class="setting-item" />
        </el-tooltip>
      </div>
      <!-- 全局设置 -->
      <el-tooltip content="主题设置" effect="dark" placement="bottom">
        <div class="setting" @click="showSidebar">
          <i class="i-carbon:settings-view"></i>
        </div>
      </el-tooltip>
      <!-- 用户头像 -->
      <el-dropdown trigger="click">
        <div class="avatar-container">
          <img :src="userStore.avatar" />
          <i-ep-caret-bottom class="w-3 h-3" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/system/account">
              <el-dropdown-item>个人信息</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click="logout"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 0 1px #0003;

  .setting-container {
    display: flex;
    gap: 5px;
    align-items: center;

    .setting-item {
      display: inline-block;
      width: 30px;
      height: 50px;
      line-height: 50px;
      color: #5a5e66;
      text-align: center;
      cursor: pointer;

      &:hover {
        background: rgb(249 250 251 / 100%);
      }
    }
  }

  .setting {
    display: inline-block;
    width: 30px;
    height: 50px;
    margin: 0 5px;
    line-height: 55px;
    color: var(--textColor);
    text-align: center;
    cursor: pointer;

    i {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background: var(--textHover);
    }
  }

  .avatar-container {
    display: flex;
    align-items: center;
    justify-items: center;
    margin: 0 5px;
    cursor: pointer;

    img {
      width: 40px;
      height: 40px;
      border-radius: 5px;
    }
  }
}
</style>
