import { Container } from './Container'
import { computed, ref, watchEffect } from 'vue'
import { ActionButtons } from '@/views/energyFee/components/ActionButtons'
import type { ActionButtonsProps } from '@/views/energyFee/components/ActionButtons'
export function useContainer() {
  const containerRef = ref<InstanceType<typeof Container>>()
  const actionButtonsOptions = computed<ActionButtonsProps['options']>(() => [
    {
      label: '新增',
      onClick: containerRef.value?.onAdd,
    },
    {
      label: '删除',
      onClick: containerRef.value?.onBatchDelete,
      disabled: (containerRef.value?.selectionRows || []).length === 0,
    },
    {
      label: '导入',
    },
    {
      label: '导出',
    },
  ])

  const render = () => <Container ref={containerRef} />
  const tabRender = () => <ActionButtons options={actionButtonsOptions.value} />

  return {
    Container: render,
    tabRender,
  }
}
