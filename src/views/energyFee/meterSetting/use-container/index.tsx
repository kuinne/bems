import { computed } from 'vue'
import { ActionButtons } from '@/views/energyFee/components/ActionButtons'
import type { ActionButtonsProps } from '@/views/energyFee/components/ActionButtons'
import { Confirm } from '@/views/energyFee/common/components/ConfirmDialog'

import { useTable } from '../use-table'
import { useFilter } from '../use-filter'
import { useTree } from '../use-tree'
import { useAdd } from '../use-add'
import { useDelete } from '../use-delete'
import { useImport } from '../use-import'
import { Layout } from '@/views/energyFee/common/components/Layout'
export function useContainer() {
  const { Tree, currentNodeKey } = useTree()
  const { Filter, filterObj } = useFilter()

  const { Add, open } = useAdd()

  const { Import, open: openImport } = useImport({
    energyBillingSettingId: currentNodeKey,
  })

  const { open: openDelete } = useDelete()

  const { Table, selectionRows, update, clearSelection } = useTable({
    filterObj: computed(() => ({
      ...filterObj.value,
      energyBillingSettingId: currentNodeKey,
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
    {
      label: '导入',
      onClick: openImport,
    },
    {
      label: '导出',
      onClick: async () => {
        try {
          await Confirm({
            type: 'warning',
            title: '确认导出',
          })
        } catch (error) {}
      },
    },
  ])

  const render = () => (
    <>
      <Layout>
        {{
          tree: Tree,
          filter: Filter,
          table: Table,
        }}
      </Layout>
      <Add />
      <Import />
    </>
  )
  const tabRender = () => <ActionButtons options={actionButtonsOptions.value} />

  return {
    Container: render,
    tabRender,
  }
}
