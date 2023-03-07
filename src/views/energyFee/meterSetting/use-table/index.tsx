import { ref, watch, Ref, toRaw, watchEffect } from 'vue'

import { Table } from '@/views/energyFee/common/components/Table'
import type { TableProps } from '@/views/energyFee/common/components/Table'
import { i18n } from '@/utils/i18n'
import { getMeterSettingList } from '@/views/energyFee/apis'
import { DasIcon } from '@/das-fe/ui'

export function useTable(options: { filterObj: Ref<any>; onEdit: (row: any) => Promise<unknown>; onView: (row: any) => Promise<unknown>; onDelete: (ids: string[]) => Promise<unknown> }) {
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
  const data = ref<TableProps['data']>([])
  const loading = ref<TableProps['loading']>(false)
  const total = ref<TableProps['total']>(0)
  const selectionRows = ref<TableProps['columns']>([])
  const page = ref<TableProps['page']>({
    pageSize: 10,
    curPage: 1,
  })

  const filterObj = ref({
    name: '',
    ...options.filterObj.value,
  })

  const fetchData = async () => {
    loading.value = true
    const params = {
      ...page.value,
      ...filterObj.value,
    }
    const [error, res] = await getMeterSettingList(params)

    if (!error) {
      data.value = res.data

      total.value = res.total
    }

    loading.value = false
  }

  const handleView = async (row: any) => {
    console.log('~~~~~~~~', selectionRows.value)

    const shouldUpdate = await options.onView(row)
    if (shouldUpdate) {
      fetchData()
    }
  }

  const handleEdit = async (row: any) => {
    const shouldUpdate = await options.onEdit(row)

    if (shouldUpdate) {
      fetchData()
    }
  }

  const handleDelete = async (row: any) => {
    const shouldUpdate = await options.onDelete([row.id])

    if (shouldUpdate) {
      fetchData()
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
      <Table
        ref={tableRef}
        columns={columns.value}
        data={data.value}
        loading={loading.value}
        total={total.value}
        v-model:selectionRows={selectionRows.value}
        v-model:page={page.value}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    )
  }

  return {
    Table: render,
    selectionRows,
    update: () => {
      fetchData()
    },
    clearSelection: () => {
      tableRef.value?.clearSelection()
    },
  }
}
