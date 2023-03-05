<template>
  <das-dialog
    v-model="delVisible"
    type="feedback"
    :feedType="type"
    size="mini"
    width="460"
    :title="title"
    class="thingmodel-del-confirm-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template #feedbackImg>
      <img class="tips-img" src="../images/del-tips.png" alt="" v-if="type === 'primary'" />
      <img class="tips-img" src="../images/warning-tips.png" alt="" v-if="type === 'warning'" />
    </template>
    <div class="tips-content" v-html="content"></div>
    <template #footer>
      <das-button btnType="default" @click="handleCancelDel">{{ i18n('取消' as any).value }}</das-button>
      <das-button btnType="primary" class="second-btn" @click="handleConfirmDel">{{ i18n('确定' as any).value }}</das-button>
    </template>
  </das-dialog>
</template>
<script setup lang="ts">
import { i18n } from '@/utils/i18n'
import { ref, watchEffect, defineProps, defineEmits, withDefaults } from 'vue'
import { DasDialog, DasButton } from '@/das-fe/ui'
interface delDialogProps {
  visible: boolean
  title: string
  content: any
  type?: any
}
const props = withDefaults(defineProps<delDialogProps>(), {
  visible: false,
  title: '操作确认',
  content: `删除后将无法恢复， <br />确定要删除该记录吗？`,
  type: 'primary',
})
let delVisible = ref<boolean>(props.visible)

const emit = defineEmits(['update:visible', 'cancel', 'confirm'])

const handleCancelDel = (): void => {
  emit('cancel')
}
watchEffect(() => {
  if (!delVisible.value) {
    emit('update:visible', delVisible.value)
    handleCancelDel()
  }
})

const handleConfirmDel = (): void => {
  emit('confirm')
}
</script>
<style lang="scss" scoped>
.thingmodel-del-confirm-dialog {
  .tips-content {
    font-weight: 400;
    font-size: 16px;
    color: #212121;
    text-align: center;
    line-height: 24px;
  }
  .tips-img {
    display: inline-block;
  }
}
</style>
<style lang="scss">
.thingmodel-del-confirm-dialog {
  .second-btn {
    margin-left: 12px;
  }
}
</style>
