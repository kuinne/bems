<template>
  <das-dialog
    v-model="visible"
    type="feedback"
    :feedType="type"
    size="mini"
    width="460"
    :title="title"
    class="confirm-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <template #feedbackImg>
      <img class="tips-img" src="../../../images/del-tips.png" alt="" v-if="type === 'delete'" />
      <img class="tips-img" src="../../../images/warning-tips.png" alt="" v-if="type === 'warning'" />
      <img class="tips-img" src="../../../images/info-tips.png" alt="" v-if="type === 'primary'" />
    </template>
    <div class="tips-content" v-html="content"></div>
    <template #footer>
      <das-button btnType="default" @click="handleClose">{{ i18n('取消' as any).value }}</das-button>
      <das-button btnType="primary" class="second-btn" @click="handleConfirm">{{ i18n('确定' as any).value }}</das-button>
    </template>
  </das-dialog>
</template>
<script setup lang="ts">
import { i18n } from '@/utils/i18n'
import { ref, watchEffect, defineProps, defineEmits, withDefaults } from 'vue'
import { DasDialog, DasButton } from '@/das-fe/ui'
import type { Props, Emits } from './type'

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '操作确认',
  content: `删除后将无法恢复， <br />确定要删除该记录吗？`,
  type: 'primary',
})

const emit = defineEmits<Emits>()

const visible = ref<boolean>(props.visible)

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

watchEffect(() => {
  visible.value = props.visible
})
</script>
<style lang="scss" scoped>
.confirm-dialog {
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
.confirm-dialog {
  .second-btn {
    margin-left: 12px;
  }
}
</style>
