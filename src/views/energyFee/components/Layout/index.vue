<template>
  <div class="layout-container">
    <das-split-panel canDrag canFold :defaultSplit="defaultSplit" :firstMin="firstMin">
      <template #firstSlot>
        <slot name="aside"></slot>
      </template>
      <template #secondSlot>
        <slot name="main"></slot>
      </template>
    </das-split-panel>
  </div>
</template>

<script setup lang="ts">
import { DasSplitPanel } from '@/das-fe/ui'
import { ref } from 'vue'

// 分隔面板
let defaultSplit = ref({ first: 336 })
let firstMin = ref(336)
</script>
<style scoped lang="scss">
.layout-container {
  height: 100%;
  :deep(.das-ui-split-panel) {
    border: none;
  }
}
</style>
