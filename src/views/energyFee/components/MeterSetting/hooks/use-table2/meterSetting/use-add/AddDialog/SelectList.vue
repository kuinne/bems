<template>
  <das-select-list labelKey="meterName" valueKey="id" v-model="list" width="200px" height="480px" @item-remove="itemRemove" @remove-all="removeAll"></das-select-list>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { DasSelectList } from '@/das-fe/ui'

const props = defineProps<{
  selectionRows: any[]
}>()

const emits = defineEmits<{
  ($event: 'update:selectionRows', val: any[]): void
}>()
const list = ref(props.selectionRows)

watch(
  () => list.value,
  () => {
    emits('update:selectionRows', list.value)
  },
)

watch(
  () => props.selectionRows,
  () => {
    list.value = props.selectionRows
  },
)

const removeAll = (items: any[]) => {
  console.log('移除的数据：', items)
}

const itemRemove = (item: any) => {
  console.log('移除的数据：', item)
}
</script>
<style scoped lang="scss"></style>
