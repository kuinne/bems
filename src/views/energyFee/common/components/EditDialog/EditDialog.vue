<template>
  <das-dialog :title="title" v-model="visible" @close="handleClose" width="1170">
    <das-spin full :spinning="props.loading">
      <div ref="$myDialogBody" class="body-container">
        <das-form v-if="visible" :cols="4" marginRight="50px" labelPosition="top" alignType="horizontal">
          <das-form-item
            v-for="item in formItems"
            :key="item.prop"
            v-bind="item"
            v-model="formData[item.prop]"
            v-model:error="validateErrors[item.prop]"
            :class="{ ['form-item-right']: item.isRight }"
          >
            <Render v-if="item.render" :render="item.render"></Render>
          </das-form-item>
        </das-form>
      </div>
    </das-spin>
    <template #footer>
      <das-button class="submit-btn" btnType="primary" @click="handleSubmit" v-if="['edit', 'add'].includes(props.type)" :disabled="props.loading">{{ i18n('提交' as any).value }}</das-button>
      <das-button @click="handleCancel">{{ i18n('取消' as any).value }}</das-button>
    </template>
  </das-dialog>
</template>

<script setup lang="ts">
import { DasDialog, DasForm, DasFormItem, DasButton, DasSpin } from '@/das-fe/ui'

import type { Props, Emits } from './type'
import { ref, toRaw, unref, watchEffect, computed } from 'vue'
import Render from '../Render/index.vue'
import { i18n } from '@/utils/i18n'

const $myDialogBody = ref()
const popupCont = (triggerNode: any) => {
  return $myDialogBody.value?.parentNode.parentNode
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const visible = ref(false)

const formData = ref<any>({})

const title = computed(() => {
  const map = {
    edit: '编辑',
    add: '新增',
    view: '查看',
  }
  return map[props.type] + props.title
})

const formItems = computed<any[]>(() => {
  return props.formItems.map((item) => {
    let res: any = item
    if (item.type === 'select' && !res.getPopupContainer) {
      res.getPopupContainer = popupCont
    }
    if (props.type === 'view') {
      res.isView = true
    }
    return res
  })
})
const validateErrors = ref<Record<string, string>>({})

const handleClose = () => {
  emits('close')
}

const handleCancel = () => {
  emits('close')
}

const validate = () => {
  validateErrors.value = {}
  let flag = true

  for (let [prop, value] of Object.entries(formData.value)) {
    const formItem = props.formItems.find((item) => item.prop === prop)

    if (formItem && formItem.validator) {
      const error = formItem.validator(value)

      if (error) {
        flag = false
        validateErrors.value[prop] = error || ''
      }
    }
  }

  return flag
}

const resetForm = () => {
  formData.value = {}
}

const handleSubmit = () => {
  if (!validate()) return
  emits('submit', formData.value)
}

watchEffect(() => {
  visible.value = props.visible
  if (!props.visible) {
    resetForm()
  }
})
watchEffect(() => {
  formData.value = props.formData
})
</script>

<style scoped lang="scss">
:deep(.submit-btn) {
  margin-right: 10px;
}
.form-item-right {
  margin-right: 0px !important;
}
.body-container {
  height: 100%;
}
</style>
