<template>
  <div class="tab-wrapper">
    <das-icon :class="['icon', { 'is-disabled': index === 0 }]" icon="left" @click="handleForward"></das-icon>

    <div class="items-wrapper">
      <div class="items-inner" :style="`transform: translateX(-${64 * index}px)`">
        <template v-for="item in props.options">
          <das-tooltip :text="item[props.labelName]" v-if="item.showTooltip">
            <div :class="['item', { 'is-active': item[props.keyName] === activeKey }]" @click="handleItemClick(item)">{{ item[props.labelName] }}</div>
          </das-tooltip>
          <div :class="['item', { 'is-active': item[props.keyName] === activeKey }]" v-else @click="handleItemClick(item)">{{ item[props.labelName] }}</div>
        </template>
      </div>
    </div>
    <das-icon :class="['icon', { 'is-disabled': index === options.length % 3 }]" icon="right" @click="handleBack"></das-icon>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { DasIcon, DasTooltip } from '@/das-fe/ui'

const props = withDefaults(
  defineProps<{
    options: any[]
    modelValue: string
    labelName?: string
    keyName?: string
  }>(),
  {
    labelName: 'label',
    keyName: 'key',
  },
)

const emits = defineEmits<{
  ($event: 'update:modelValue', val: any): void
}>()
const index = ref(0)

const activeKey = ref(props.modelValue)

watch(
  () => props.modelValue,
  () => {
    activeKey.value = props.modelValue
  },
)

const handleForward = () => {
  if (index.value > 0) {
    index.value = index.value - 1
  }
}

const handleBack = () => {
  if (index.value < props.options.length - 1) {
    index.value = index.value + 1
  }
}

const handleItemClick = (item: any) => {
  activeKey.value = item[props.keyName]
  emits('update:modelValue', item[props.keyName])
}
</script>
<style scoped lang="scss">
.tab-wrapper {
  margin-top: 8px;
  display: flex;
  align-items: center;
  .icon {
    width: 14px;
    cursor: pointer;
    fill: #5582f3;
    &.is-disabled {
      fill: #666666;
      cursor: not-allowed;
    }
  }
  .items-wrapper {
    border-radius: 2px;
    overflow: hidden;

    width: 194px;
  }
  .items-inner {
    display: flex;
    transition: all 0.3s linear;
  }
  .item {
    flex-shrink: 0;
    width: 64px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    padding: 0 3px;

    font-size: 12px;

    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    border: 1px solid rgba(217, 217, 217, 1);
    user-select: none;
    &:not(:last-child) {
      border-right: none;
    }
    box-sizing: border-box;
    transition: background 0.15s linear;

    &.is-active {
      color: #fff;
      background: #5582f3;
      border-color: #5582f3;
    }
  }
}
</style>
