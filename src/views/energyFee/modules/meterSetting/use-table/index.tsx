import { ref, watch, Ref, toRaw, watchEffect, computed } from 'vue'

import { Table } from '@/views/energyFee/common/components/Table'
import type { TableProps } from '@/views/energyFee/common/components/Table'
import { i18n } from '@/utils/i18n'
import { getMeterSettingList } from '@/views/energyFee/apis'
import StatusTag from '../StatusTag.vue'
import { useFetchList } from '../../../common/hooks/use-fetch-list'
import { DasSpin } from '@/das-fe/ui'
import { MeterType } from '../enums'
export function useTable(options: { filterObj: Ref<any> }) {
  const tableRef = ref<InstanceType<typeof Table>>()
  const columns = ref<TableProps['columns']>([
    {
      label: i18n('表计编码' as any).value,
      prop: 'meterCode',
    },
    {
      label: i18n('表计名称' as any).value,
      prop: 'meterName',
    },
    {
      label: i18n('能源分类' as any).value,
      prop: 'energyTypeName',
    },
    {
      label: i18n('表计类型' as any).value,
      prop: 'meterTypeName',
    },
    {
      label: i18n('表计状态' as any).value,
      prop: 'status',
      render: ({ row }) => <StatusTag status={row.status} />,
    },
  ])
  const selectionRows = ref<TableProps['columns']>([])

  const loading = ref(false)
  const total = ref(0)
  const data = ref<any[]>([])
  const page = ref({
    curPage: 1,
    pageSize: 20,
  })
  const filterObj = ref({
    meterType: MeterType.ALL,
    search: '',
    energyBillingSettingId: '',
  })

  const fetchData = async () => {
    if (!filterObj.value.energyBillingSettingId) return

    console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡 meterSetting/use-table-fetchData', filterObj.value)

    loading.value = true
    data.value = []
    const [error, res] = await getMeterSettingList({
      pageIndex: page.value.curPage,
      pageSize: page.value.pageSize,
      ...filterObj.value,
    })
    loading.value = false
    if (!error) {
      data.value = res.records
      total.value = res.total
    }
  }

  watch(
    () => options.filterObj.value,
    () => {
      filterObj.value = {
        ...filterObj.value,
        ...options.filterObj.value,
      }
    },
    {
      deep: true,
    },
  )
  watch(
    () => filterObj.value,
    (val: any, oldVal: any) => {
      if (JSON.stringify(val) === JSON.stringify(oldVal)) return
      page.value.curPage = 1
      fetchData()
    },
    {
      deep: true,
    },
  )

  const handleCurrentPageChange = () => {
    fetchData()
  }

  const handlePageSizeChange = () => {
    page.value.curPage = 1
    fetchData()
  }

  const clearSelection = () => {
    selectionRows.value = []
    tableRef.value?.clearSelection()
  }

  const render = () => {
    return (
      <DasSpin full spinning={loading.value}>
        <Table
          ref={tableRef}
          columns={columns.value}
          data={data.value}
          total={total.value}
          v-model:selectionRows={selectionRows.value}
          v-model:page={page.value}
          actions={[]}
          emptyText={loading.value ? '' : i18n('暂无数据' as any).value}
          onCurrentPageChange={handleCurrentPageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </DasSpin>
    )
  }

  return {
    Table: render,
    selectionRows,
    update: fetchData,
    page,
    clearSelection,
  }
}
