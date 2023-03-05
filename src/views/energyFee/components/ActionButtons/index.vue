<template>
  <div class="action-buttons-wrapper">
    <das-button v-for="item in props.options" btn-type="primary" :disabled="item.disabled" @click="item.onClick">{{ item.label }}</das-button>
  </div>
</template>

<script setup lang="ts">
import { DasButton } from '@/das-fe/ui'
import type { Props, Emits } from './type'

const props = defineProps<Props>()
</script>
<style scoped lang="scss">
.action-buttons-wrapper {
  display: flex;
  gap: 12px;
}
</style>
