<script setup lang='ts'>
import { reactive } from 'vue'
import { validatePassword } from '@/utils/validate';
import { FormInstance } from 'element-plus';
const ruleFormRef = ref()
const rules = {
  oldPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  newPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  confirmNewPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }],
}
const formData = reactive({
  oldPassword: undefined,
  newPassword: undefined,
  confirmNewPassword: undefined
})

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      updatePassWord()
    }
  })
}

const btnLoading = ref(false)
async function updatePassWord() {
  try {
    if (formData.newPassword !== formData.confirmNewPassword) return ElMessage.error('两次新密码设置不一致，请检查！');
    await API.post({
      url: '/admin/sys/user/passWord/updatePassword',
      data: formData
    })
    ElMessage.success('密码修改成功！')
    resetForm(ruleFormRef.value)
  } catch (error) {
    console.log('error: ', error);
  }
}
</script>

<template>
 <div>
  <el-form ref="ruleFormRef" :model="formData" :rules="rules" :label-width="120">
    <el-form-item label="旧密码：" prop="oldPassword">
      <el-input v-model.trim="formData.oldPassword" type="password" placeholder="请输入旧密码"></el-input>
    </el-form-item>
    <el-form-item label="新密码：" prop="newPassword">
      <el-input v-model.trim="formData.newPassword" type="password" placeholder="请输入新密码"></el-input>
    </el-form-item>
    <el-form-item label="确认密码：" prop="confirmNewPassword">
      <el-input v-model.trim="formData.confirmNewPassword" type="password" placeholder="请再次输入密码以确认"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="btnLoading" @click="submitForm(ruleFormRef)">更新密码</el-button>
    </el-form-item>
  </el-form>
 </div>
</template>