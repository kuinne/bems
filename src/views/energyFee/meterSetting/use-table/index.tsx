import { ref, watch, Ref, toRaw, watchEffect, computed } from 'vue'

import { Table } from '@/views/energyFee/common/components/Table'
import type { TableProps } from '@/views/energyFee/common/components/Table'
import { i18n } from '@/utils/i18n'
import { getMeterSettingList } from '@/views/energyFee/apis'
import StatusTag from '../StatusTag.vue'

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
  const data = ref<TableProps['data']>([])
  const loading = ref<TableProps['loading']>(false)
  const total = ref<TableProps['total']>(0)
  const selectionRows = ref<TableProps['columns']>([])
  const page = ref<TableProps['page']>({
    pageSize: 20,
    curPage: 1,
  })

  const filterObj = ref({
    name: '',
    ...options.filterObj.value,
  })

  const fetchData = async () => {
    loading.value = true
    const params = {
      pageIndex: page.value.curPage,
      pageSize: page.value.pageSize,
      ...filterObj.value,
    }
    const [error, res] = await getMeterSettingList(params)

    if (!error) {
      data.value = res.records
    }

    loading.value = false
    total.value = parseFloat(res.total || 0)
  }

  const clearSelection = () => {
    selectionRows.value = []
    tableRef.value?.clearSelection()
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
    () => page.value,
    () => {
      filterObj.value = {
        ...filterObj.value,
        ...page.value,
      }
    },
    {
      deep: true,
    },
  )

  watch(
    () => [page.value, filterObj.value],
    () => {
      fetchData()
    },
  )

  const render = () => {
    return (
      <Table ref={tableRef} columns={columns.value} data={data.value} loading={loading.value} total={total.value} v-model:selectionRows={selectionRows.value} v-model:page={page.value} actions={[]} />
    )
  }

  return {
    Table: render,
    selectionRows,
    page,
    update: () => {
      fetchData()
    },
    clearSelection,
  }
}
