
<script setup lang='ts'>
import ProFile from "./components/ProFile.vue"
import SecureSetting from "./components/SecureSetting.vue"
</script>
 
<template>
 <div>
  <el-tabs tab-position="left">
    <el-tab-pane label="基本资料">
      <ProFile></ProFile>
    </el-tab-pane>
    <el-tab-pane label="安全设置">
      <SecureSetting></SecureSetting>
    </el-tab-pane>
  </el-tabs>
 </div>
</template>

<style lang="scss" scoped>
:deep(.el-form-item__content > div) {
  width: 100%;
}
</style>