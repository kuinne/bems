import { ref, watch, Ref, toRaw, watchEffect } from 'vue'

import { Table } from '@/views/energyFee/common/components/Table'
import type { TableProps } from '@/views/energyFee/common/components/Table'
import { i18n } from '@/utils/i18n'
import { getSetting } from '@/views/energyFee/apis'
import { optionsToEnums } from '@/views/energyFee/common/utils'
import { charingTypeOptions } from '@/views/energyFee/charingSetting/constants'
export function useTable(options: { filterObj: Ref<any>; onEdit: (row: any) => Promise<unknown>; onView: (row: any) => Promise<unknown>; onDelete: (ids: string[]) => Promise<unknown> }) {
  const tableRef = ref<InstanceType<typeof Table>>()
  const columns = ref<TableProps['columns']>([
    {
      label: i18n('计费标准' as any).value,
      prop: 'name',
      contentType: 'link',
      onClickLink: (row: any) => {
        handleView(row)
      },
    },
    {
      label: i18n('能源分类' as any).value,
      prop: 'energyTypeName',
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
  const data = ref<TableProps['data']>([])
  const loading = ref<TableProps['loading']>(false)
  const total = ref<TableProps['total']>(0)
  const selectionRows = ref<TableProps['columns']>([])
  const page = ref<TableProps['page']>({
    pageSize: 10,
    curPage: 1,
  })

  const filterObj = ref({
    ...options.filterObj.value,
  })

  const fetchData = async () => {
    loading.value = true
    const params = {
      pageIndex: page.value.curPage,
      pageSize: page.value.pageSize,
      ...filterObj.value,
    }
    const [error, res] = await getSetting(params)

    if (!error) {
      data.value = res.records
      console.log('data', data.value)

      total.value = res.total
    }

    loading.value = false
  }

  const handleView = async (row: any) => {
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

  fetchData()

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
