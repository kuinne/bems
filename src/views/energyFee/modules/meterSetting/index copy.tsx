import { computed, defineComponent, defineExpose, onActivated } from 'vue'
import { ActionButtons } from '@/views/energyFee/common/components/ActionButtons'
import type { ActionButtonsProps } from '@/views/energyFee/common/components/ActionButtons'

import { useTable } from './use-table'
import { useFilter } from './use-filter'
import { useTree } from './use-tree'
import { useAdd } from './use-add'
import { useDelete } from './use-delete'
import { useImport } from './use-import'
import { useExport } from './use-export'
import { Layout } from '@/views/energyFee/common/components/Layout'
import { vAuth } from '@/utils/directive'

export default defineComponent({
  setup() {
    const { Tree, currentNodeKey, energyType, update: updateTree } = useTree()
    const { Filter, filterObj } = useFilter()

    const { Add, open: openAdd } = useAdd({
      energyType,
      energyBillingSettingId: currentNodeKey,
    })

    const { Import, open: openImport } = useImport({
      energyBillingSettingId: currentNodeKey,
      onFinish: () => {
        updateTree()
        updateTable()
      },
    })

    const { Export, open: openExport } = useExport()

    const { open: openDelete } = useDelete()

    const {
      Table,
      selectionRows,
      update: updateTable,
      clearSelection,
      page,
    } = useTable({
      filterObj: computed(() => ({
        ...filterObj.value,
        energyBillingSettingId: currentNodeKey,
      })),
    })

    const actionButtonsOptions = computed<ActionButtonsProps['options']>(() => {
      const res: any[] = []
      if (
        vAuth(null, {
          code: 'meterSetting-add',
        })
      ) {
        res.push({
          label: '新增',
          onClick: () => {
            openAdd(() => {
              updateTree()
              updateTable()
            })
          },
        })
      }
      if (
        vAuth(null, {
          code: 'meterSetting-delete',
        })
      ) {
        res.push({
          label: '删除',
          onClick: async () => {
            openDelete(
              selectionRows.value.map((item: any) => item.id),
              () => {
                clearSelection()
                updateTree()
                updateTable()
              },
            )
          },
          disabled: (selectionRows.value || []).length === 0,
        })
      }

      if (
        vAuth(null, {
          code: 'meterSetting-import',
        })
      ) {
        res.push({
          label: '导入',
          onClick: openImport,
        })
      }
      return [
        ...res,
        {
          label: '导出',
          onClick: () => {
            openExport({
              pageIndex: page.value.curPage,
              pageSize: page.value.pageSize,
              energyBillingSettingId: currentNodeKey.value,
              meterType: filterObj.value.meterType,
              search: filterObj.value.search,
            })
          },
        },
      ]
    })

    const render = () => (
      <>
        <Layout>
          {{
            tab: () => <ActionButtons options={actionButtonsOptions.value} />,
            tree: Tree,
            filter: Filter,
            table: Table,
          }}
        </Layout>
        <Add />
        <Import />
        <Export />
      </>
    )
    onActivated(() => {
      console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡meterSetting')
    })

    defineExpose({
      update: () => {
        updateTree()
        updateTable()
      },
    })
    return render
  },
})
