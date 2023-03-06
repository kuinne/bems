import { getMeterSettingList } from '@/views/energyFee/apis'
import { optionsToEnums } from '@/views/energyFee/common/utils'
import { computed, defineAsyncComponent, ref, Ref, watch, watchEffect } from 'vue'
import type { UseTableOptions, FilterObj } from './type'
import { i18n } from '@/utils/i18n'
import { MeterType } from '../../enums'

export function useTable({ onEdit, onDelete, onView, energyBillingSettingId, filterObj }: UseTableOptions<any>) {
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
      label: i18n('表计编码' as any).value,
      prop: 'meterCode',
    },
    {
      label: i18n('表计名称' as any).value,
      prop: 'meterName',
    },
    {
      label: i18n('能源类型' as any).value,
      prop: 'energyTypeName',
    },
    {
      label: i18n('表计类型' as any).value,
      prop: 'meterTypeName',
    },
    {
      label: i18n('表计状态' as any).value,
      prop: 'status',
    },
  ])

  const loadData: TableProps['loadData'] = async (params: any) => {
    const [error, data] = await getMeterSettingList({
      pageIndex: params.tablePage?.curPage!,
      pageSize: params.tablePage?.pageSize!,
      energyBillingSettingId: params.filterObj?.energyBillingSettingId,
      meterType: params.filterObj?.meterType || MeterType.ALL,
      search: params.filterObj?.search,
    })

    return {
      total: data.total,
      data: data.records,
    }
  }

  const Table = () => <TableSFC autoLoadData={false} actions={[]} ref={tableRef} columns={columns.value} loadData={loadData} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />

  const reload = (params?: FilterObj) => {
    return tableRef.value?.reload(params)
  }

  watch(
    () => [energyBillingSettingId.value, tableRef.value],
    () => {
      if (energyBillingSettingId.value !== undefined) {
        reload({
          filterObj: {
            energyBillingSettingId: energyBillingSettingId.value,
          },
        })
      }
    },
    {
      immediate: true,
    },
  )

  return {
    Table,
    reload,
    multipleSection: computed(() => tableRef.value?.multipleSection || []),
  }
}
