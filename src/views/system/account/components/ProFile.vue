<script setup lang='ts'>
import { reactive } from 'vue'
import { validatePhone } from '@/utils/validate';
import { FormInstance } from 'element-plus';

const options = ref([
  {
    label: '保密',
    value: 0,
  },
  {
    label: '女',
    value: 1,
  },
  {
    label: '男',
    value: 2,
  }
])

const ruleFormRef = ref()

const rules = {
  userName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  mobile: [{ required: true, validator: validatePhone, trigger: 'blur' }],
}
const formData = reactive({
  userName: undefined,
  gender: 0,
  mobile: undefined,
  avatar: undefined
})

async function handleGenAvatar() {
  try {
    const result: any = await API.get({
      url: '/admin/sys/user/avatar/generate'
    })
    if (result.avatarUrl) {
      formData.avatar = result.avatarUrl
    }
  } catch (error) {
    console.log('error: ', error);
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      updateInfo()
    }
  })
}

const btnLoading = ref(false)
async function updateInfo() {
  try {
    btnLoading.value = true
    await API.post({
      url: '/admin/sys/user/profile/updateProfile',
      data: formData
    })
    btnLoading.value = false
    ElMessage.success('保存成功！')
  } catch (error) {
    btnLoading.value = false
    console.log('error: ', error);
  }
}

async function getUser() {
  try {
    const result = await API.get({
      url: '/admin/sys/user/profile/info'
    })
    Object.keys(formData).forEach(key => {
      formData[key] = result[key]
    });
  } catch (error) {
    console.log('error: ', error);
  }
}

onMounted(async () => {
  await getUser()
})
</script>

<template>
 <div>
  <el-form ref="ruleFormRef" :model="formData" :rules="rules" :label-width="120">
    <el-form-item label="头像：" prop="avatar">
      <el-avatar :size="80" :src="formData.avatar" />
      <el-button class="ml-4" @click="handleGenAvatar">生成头像</el-button>
    </el-form-item>
    <el-form-item label="用户昵称：" prop="userName">
      <el-input v-model.trim="formData.userName" clearable maxlength="50" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="性别：" prop="gender">
      <el-select v-model="formData.gender">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="手机号：" prop="mobile">
      <el-input v-model.trim="formData.mobile" clearable maxlength="11" show-word-limit></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="btnLoading" @click="submitForm(ruleFormRef)">更新信息</el-button>
    </el-form-item>
  </el-form>
 </div>
</template>