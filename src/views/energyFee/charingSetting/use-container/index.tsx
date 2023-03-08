import { computed } from 'vue'
import { ActionButtons } from '@/views/energyFee/components/ActionButtons'
import type { ActionButtonsProps } from '@/views/energyFee/components/ActionButtons'
import { useTable } from '../use-table'
import { useTree } from '../use-tree'
import { useAdd } from '../use-add'
import { useDelete } from '../use-delete'
import { Layout } from '@/views/energyFee/common/components/Layout'

export function useContainer() {
  const { Tree, currentNodeKey, energyTypeOptions } = useTree()

  const { open } = useAdd({
    energyTypeOptions,
  })

  const { open: openDelete } = useDelete()

  const { Table, selectionRows, update, clearSelection } = useTable({
    filterObj: computed(() => ({
      energyTypeId: currentNodeKey,
    })),
    onEdit: (row: any) => {
      return open('edit', row)
    },
    onView: (row: any) => {
      return open('view', row)
    },
    onDelete: (ids: any) => {
      return openDelete(ids)
    },
  })

  const actionButtonsOptions = computed<ActionButtonsProps['options']>(() => [
    {
      label: '新增',
      onClick: async () => {
        const shouldUpdate = await open('add')
        if (shouldUpdate) {
          update()
        }
      },
    },
    {
      label: '删除',
      onClick: async () => {
        const shouldUpdate = await openDelete(selectionRows.value.map((item: any) => item.id))
        if (shouldUpdate) {
          update()
        }
        clearSelection()
      },
      disabled: (selectionRows.value || []).length === 0,
    },
  ])

  const render = () => (
    <>
      <Layout>
        {{
          tree: Tree,
          table: Table,
        }}
      </Layout>
    </>
  )

  const tabRender = () => <ActionButtons options={actionButtonsOptions.value} />

  return {
    Container: render,
    tabRender,
  }
}
