<template>
  <span class="status-tag">
    <span class="dot" :style="`background: ${curItem.color}`"></span>
    <span class="label">{{ curItem.label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  status: number
}>()

const options = {
  0: {
    label: '未激活',
    color: '#276FF5',
  },
  1: {
    label: '在线',
    color: '#1BA854',
  },

  2: {
    label: '离线',
    color: '#666666',
  },
  3: {
    label: '已停用',
    color: '#FB2323',
  },
}

const curItem = computed(() => options[props.status])
</script>
<style scoped lang="scss">
.status-tag {
  display: flex;
  align-items: center;
  .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 4px;
  }
  .label {
    font-size: 12px;
    color: #212121;
  }
}
</style>
