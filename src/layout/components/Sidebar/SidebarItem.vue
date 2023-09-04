<script setup lang="ts">
import path from "path-browserify";
import { isExternal } from "@/utils/index";
import AppLink from "./Link.vue";

interface Imeta {
  title: string;
  icon?: string;
  hidden: boolean;
  keepAlive?: boolean;
}

interface Imenu {
  name?: string;
  path: string;
  meta: Imeta;
  component: any;
  children: Imenu[];
  redirect?: string;
}

const props = defineProps<{
  item: Imenu;
  basePath: string;
}>();

const currentRoute = ref(); // 临时变量，唯一子路由

/**
 * 判断当前路由是否只有一个子路由显示
 * @param children 子路由数组
 * @param parent 当前路由
 */
function justOneShowingChild(children: Imenu[], parent: any) {
  // 需要显示的子路由数组
  const showingChildren =
    children &&
    children.filter((item: Imenu) => {
      return item.meta.hidden === false;
    });

  //含有多个children
  if (showingChildren?.length > 1) return false;

  //如果只有一个子路由返回唯一子路由
  if (showingChildren?.length === 1) {
    return (currentRoute.value = showingChildren[0]);
  }

  return (currentRoute.value = { ...parent });
}

/**
 * 解析路径
 *
 * @param routePath 路由路径
 */
function resolvePath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  // 完整路径 = 父级路径(/level/level_3) + 路由路径
  const fullPath = path.resolve(props.basePath, routePath); // 相对路径 → 绝对路径
  return fullPath;
}
</script>
<template>
  <div v-if="item.meta && !item.meta.hidden">
    <!-- 只包含一个子路由节点的路由，显示其【唯一子路由】 -->
    <template v-if="justOneShowingChild(item.children, item)">
      <app-link v-if="currentRoute.meta" :to="resolvePath(currentRoute.path)">
        <el-menu-item :index="resolvePath(currentRoute.path)">
          <i
            v-if="currentRoute.meta?.icon"
            :class="`i-${currentRoute.meta.icon}`"
          ></i>
          <template #title>
            {{ currentRoute.meta.title }}
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <!-- 包含多个子路由  -->
    <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
      <template #title>
        <i v-if="item.meta?.icon" :class="`i-${item.meta.icon}`"></i>
        <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>

<style lang="scss" scoped>
.el-menu-item {
  line-height: normal;
}
</style>
