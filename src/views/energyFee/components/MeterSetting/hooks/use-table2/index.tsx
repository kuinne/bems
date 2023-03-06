import { defineAsyncComponent, ref, watch, Ref, watchEffect } from 'vue'
const mockData = [
  {
    id: '1',
    name: 'sss',
    age: 23,
  },
  {
    id: '2',
    name: '3333',
    age: 23,
  },
]
const getList = (params: any) => {
  console.log('~~~~~~~~~~', params)

  return new Promise<[any, any]>((resolve) => {
    setTimeout(() => {
      const res = mockData.filter((item: any) => {
        let flag = true
        if (params.search) {
          flag = item.name.includes(params.search)
        }
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
export function useTable(options: { filterObj: Ref<any> }) {
  const TableSFC = defineAsyncComponent(() => import('@/views/energyFee/common/components/Table2/index.vue'))

  const columns = ref([
    {
      prop: 'name',
      label: '姓名',
    },
    {
      prop: 'age',
      label: '年龄',
    },
  ])
  const data = ref([])
  const loading = ref(false)
  const total = ref(0)
  const selectionRows = ref([])
  const page = ref({
    pageSize: 10,
    curPage: 1,
  })

  const filterObj = ref({
    search: '',
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

  fetchData()

  watch(
    () => options.filterObj.value,
    () => {
      filterObj.value = {
        ...filterObj.value,
        ...options.filterObj.value,
      }
    },
  )

  watch(
    () => page.value,
    () => {
      console.log('sss', page.value)

      filterObj.value = {
        ...filterObj.value,
        ...page.value,
      }
    },
  )

  watch(
    () => [page.value, filterObj.value],
    () => {
      fetchData()
    },
  )

  const Table = () => {
    return <TableSFC columns={columns.value} data={data.value} loading={loading.value} total={total.value} v-model:selectionRows={selectionRows.value} v-model:page={page.value} />
  }

  return {
    Table,
  }
}
