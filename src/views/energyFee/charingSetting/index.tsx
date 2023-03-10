import { computed, defineComponent, onActivated, onMounted } from 'vue'
import { ActionButtons } from '@/views/energyFee/common/components/ActionButtons'
import type { ActionButtonsProps } from '@/views/energyFee/common/components/ActionButtons'
import { useTable } from './use-table'
import { useTree } from './use-tree'
import { useAdd } from './use-add'
import { useDelete } from './use-delete'
import { Layout } from '@/views/energyFee/common/components/Layout'
import { vAuth } from '@/utils/directive'

export default defineComponent({
  setup() {
    const { Tree, currentNode, update: updateTree } = useTree()

    const { open, Add } = useAdd({
      currentEnergyType: currentNode,
    })

    const { open: openDelete } = useDelete()

    const {
      Table,
      selectionRows,
      update: updateTable,
      clearSelection,
    } = useTable({
      filterObj: computed(() => ({
        energyTypeId: currentNode.value.id,
      })),
      onEdit: (row: any) => {
        open('edit', row, () => {
          {
            updateTable()
            updateTree()
          }
        })
      },
      onView: (row: any) => {
        open('view', row)
      },
      onDelete: (ids: any) => {
        openDelete(ids, () => {
          updateTable()
          updateTree()
        })
      },
    })

    const actionButtonsOptions = computed<ActionButtonsProps['options']>(() => {
      const res: any = []
      if (vAuth(null, { code: 'charingSetting-add' })) {
        res.push({
          label: '新增',
          onClick: () => {
            open('add', null, () => {
              updateTable()
              updateTree()
            })
          },
        })
      }

      if (vAuth(null, { code: 'charingSetting-delete' })) {
        res.push({
          label: '删除',
          onClick: async () => {
            openDelete(
              selectionRows.value.map((item: any) => item.id),
              () => {
                clearSelection()
                updateTable()
                updateTree()
              },
            )
          },
          disabled: (selectionRows.value || []).length === 0,
        })
      }
      return res
    })

    const render = () => (
      <>
        <Layout>
          {{
            tab: () => <ActionButtons options={actionButtonsOptions.value} />,
            tree: Tree,
            table: Table,
          }}
        </Layout>
        <Add />
      </>
    )

    defineExpose({
      update: () => {
        updateTree()
        updateTable()
      },
    })
    return render
  },
})
