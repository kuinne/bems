import { ref, watch, Ref, toRaw, watchEffect } from 'vue'

import { Table } from '@/views/energyFee/common/components/Table2'
import type { TableProps } from '@/views/energyFee/common/components/Table2'
const mockData = [
  {
    id: '1',
    name: 'sss',
    age: 23,
    status: 1,
  },
  {
    id: '2',
    name: '3333',
    age: 23,
    status: 2,
  },
]
const getList = (params: any) => {
  console.log('~~~~~~~~~~', params)

  return new Promise<[any, any]>((resolve) => {
    setTimeout(() => {
      const res = mockData.filter((item: any) => {
        let flag = true
        if (params.name) {
          flag = item.name.includes(params.name)
        }
        if (params.status && params.status !== -1) {
          flag = item.status === params.status
        }
        // if (params.id !== undefined) {
        //   flag = item.id === params.id
        // }
        return flag
      })
      resolve([
        '',
        {
          data: res,
          total: res.length,
        },
      ])
    }, 300)
  })
}
export function useTable(options: { filterObj: Ref<any>; onEdit: (row: any) => Promise<unknown>; onView: (row: any) => Promise<unknown>; onDelete: (ids: string[]) => Promise<unknown> }) {
  const tableRef = ref<InstanceType<typeof Table>>()
  const columns = ref<TableProps['columns']>([
    {
      prop: 'name',
      label: '姓名',
    },
    {
      prop: 'age',
      label: '年龄',
    },
    {
      prop: 'status',
      label: '状态',
      enums: {
        1: '成功',
        2: '失败',
      },
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
    const [error, res] = await getList(params)

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
