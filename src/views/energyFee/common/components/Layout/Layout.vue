<template>
  <div class="content-container">
    <div class="content">
      <div class="tab-wrapper">
        <slot name="tab"></slot>
      </div>
      <das-split-panel :can-fold="options.canFold" :can-drag="options.canDrag" :first-min="options.firstMin" :second-min="options.secondMin" :default-split="defaultSplit">
        <template #firstSlot>
          <div class="tree-container">
            <div class="tree-content">
              <div class="tree-box" v-overlay>
                <slot name="tree"></slot>
              </div>
            </div>
          </div>
        </template>
        <template #secondSlot>
          <div class="right-container">
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

const options = ref({
  canFold: true,
  canDrag: true,
  defaultType: '1',
  defalutWidth: 225,
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
.content-container {
  flex: 1;
  min-height: 0;
  width: 100%;
  background-color: #e2e7ef;
  box-sizing: border-box;
  padding: 0 10px 10px 10px;
  .content {
    display: flex;
    flex-direction: column;
    .tab-wrapper {
      background: #fff;
      margin-bottom: 10px;
      padding: 10px 18px;
      box-sizing: border-box;
    }

    height: 100%;
    position: relative;
    .right-container {
      background: #fff;
      height: 100%;
      display: flex;
      flex-direction: column;
      z-index: 0;
      padding: 20px;
      box-sizing: border-box;
    }
  }
  .tree-container {
    background: #fff;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .tree-content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .tree-box {
        flex: 1;
        width: 100%;
        min-height: 0;
        z-index: 0;
      }
    }
  }
  :deep(.ant-spin) {
    height: 100% !important;
  }
}
</style>
