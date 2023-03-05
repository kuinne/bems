import { getSetting } from '@/views/energyFee/apis'
import { optionsToEnums } from '@/views/energyFee/common/utils'
import { computed, defineAsyncComponent, ref, Ref } from 'vue'
import { charingTypeOptions } from '../../constants'
import type { UseTableOptions } from './type'
import { i18n } from '@/utils/i18n'

export function useTable({ onEdit, onDelete, onView, energyTypeOptions }: UseTableOptions<any>) {
  const TableSFC = defineAsyncComponent(() => import('../../../../common/components/Table/index.vue'))

  const tableRef = ref<InstanceType<typeof TableSFC>>()
  type TableProps = InstanceType<typeof TableSFC>['$props']

  const handleEdit = (row: any) => {
    onEdit?.(row)
  }
  const handleView = (row: any) => {
    onView?.(row)
  }
  const handleDelete = (row: any) => {
    onDelete?.(row)
  }

  const columns = computed<TableProps['columns']>(() => [
    {
      label: i18n('计费标准' as any).value,
      prop: 'name',
      contentType: 'link',
      onClickLink: (row) => {
        handleView(row)
      },
    },
    {
      label: i18n('能源分类' as any).value,
      prop: 'energyTypeId',
      enums: optionsToEnums(energyTypeOptions.value),
    },
    {
      label: i18n('计费方式' as any).value,
      prop: 'billingMethod',
      enums: optionsToEnums(charingTypeOptions),
    },
    {
      label: i18n('备注' as any).value,
      prop: 'remark',
    },
  ])

  const loadData: TableProps['loadData'] = async (params) => {
    const [error, data] = await getSetting({
      pageIndex: params.tablePage?.curPage!,
      pageSize: params.tablePage?.pageSize!,
      energyTypeId: params.filterObj?.energyTypeId || '-1',
    })

    return {
      total: data.total,
      data: data.records,
    }
  }

  const Table = () => <TableSFC ref={tableRef} columns={columns.value} loadData={loadData} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />

  return {
    Table,
    reload: (params?: any) => {
      return tableRef.value?.reload(params)
    },
    multipleSection: computed(() => tableRef.value?.multipleSection || []),
  }
}
