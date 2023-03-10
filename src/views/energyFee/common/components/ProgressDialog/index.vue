<template>
  <das-dialog size="mini" v-model="visible" type="basic" :title="props.title" class="energyFee-progress-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
    <das-progress v-model="percent" type="circle" :status="props.status" :textMap="props.textMap"></das-progress>
  </das-dialog>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { DasDialog, DasProgress } from '@/das-fe/ui'

type DasProgressProps = InstanceType<typeof DasProgress>['$props']

const props = defineProps<{
  modelValue: boolean
  percent: number
  title: string
  status: DasProgressProps['status']
  textMap: DasProgressProps['textMap']
}>()

const emits = defineEmits<{
  ($event: 'update:modelValue', val: boolean): void
  ($event: 'update:percent', val: number): void
}>()

const visible = ref(props.modelValue)
const percent = ref(props.percent)

watch(
  () => props.modelValue,
  () => {
    visible.value = props.modelValue
  },
)

watch(
  () => visible.value,
  () => {
    emits('update:modelValue', visible.value)
  },
)

watch(
  () => props.percent,
  () => {
    percent.value = props.percent
  },
)

watch(
  () => percent.value,
  () => {
    emits('update:percent', percent.value)
  },
)
</script>

<style lang="scss">
.energyFee-progress-dialog {
  .das-dialog__body {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
