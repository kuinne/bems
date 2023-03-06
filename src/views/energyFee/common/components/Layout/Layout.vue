<template>
  <div class="layout-container">
    <div class="tab-wrapper">
      <slot name="tab"></slot>
    </div>
    <div class="main-wrapper">
      <das-split-panel :can-fold="options.canFold" :can-drag="options.canDrag" :first-min="options.firstMin" :second-min="options.secondMin" :default-split="defaultSplit">
        <template #firstSlot>
          <slot name="tree"></slot>
        </template>
        <template #secondSlot>
          <div class="right-wrapper">
            <slot name="filter"></slot>
            <slot name="table"></slot>
          </div>
        </template>
      </das-split-panel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DasSplitPanel, vOverlay } from '@/das-fe/ui'
import { ref, computed } from 'vue'

type DasSplitPanelProps = InstanceType<typeof DasSplitPanel>['$props']

const options = ref({
  canFold: true,
  canDrag: true,
  defaultType: '1',
  defalutWidth: 400,
  firstMin: 100,
  secondMin: 100,
})

const defaultSplit = computed(() => {
  if (options.value.defaultType == '1') {
    return { first: options.value.defalutWidth }
  } else {
    return { second: options.value.defalutWidth }
  }
})
</script>
<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100%;

  .tab-wrapper {
    margin-bottom: 20px;
  }
  .main-wrapper {
    height: 100%;
    background-color: #fff;
  }
  .right-wrapper {
    padding: 10px;
    box-sizing: border-box;
    height: 100%;
  }
}
</style>
