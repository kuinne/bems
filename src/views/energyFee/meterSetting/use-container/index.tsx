import { Container } from './Container'
import { computed, ref, watchEffect } from 'vue'
import { ActionButtons } from '@/views/energyFee/components/ActionButtons'
import type { ActionButtonsProps } from '@/views/energyFee/components/ActionButtons'
import { confirm } from '@/views/energyFee/common/components/ConfirmDialog'
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
      onClick: containerRef.value?.openImport,
    },
    {
      label: '导出',
      onClick: async () => {
        try {
          await confirm({
            type: 'warning',
            title: '确认导出',
          })
        } catch (error) {}
      },
    },
  ])

  const render = () => <Container ref={containerRef} />
  const tabRender = () => <ActionButtons options={actionButtonsOptions.value} />

  return {
    Container: render,
    tabRender,
  }
}
