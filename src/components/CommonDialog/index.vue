<script setup lang='ts'>
import { computed } from "vue"

interface Iprop {
  visiabel?: boolean;
  title: string
  btnLoading?: boolean;
}

const props = withDefaults(defineProps<Iprop>(), {
  visiabel: false,
  btnLoading: false,
})

const emit = defineEmits<{
  (e: 'update:visiabel', value: boolean): void,
  (e: 'update:btnLoading', value: boolean): void,
  (e: 'cancel'): void,
  (e: 'confirm'): void,
}>()

const visiableVal = computed({
  get: () => props.visiabel,
  set: (val) => {
    emit('update:visiabel', val)
  }
})

function cancel() {
  emit('cancel')
}

function confirm() {
  emit('confirm')
}
</script>

<template>
 <div v-if="visiableVal">
  <el-dialog
      v-model="visiableVal"
      :title="props.title"
      :close-on-click-modal="false"
    >
      <slot name="default"></slot>
      <template #footer>
        <span>
          <el-button :loading="props.btnLoading" @click="cancel">取消</el-button>
          <el-button type="primary" :loading="props.btnLoading" @click="confirm">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
 </div>
</template>