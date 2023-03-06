import { defineAsyncComponent, ref, watch, Ref } from 'vue'

const getList = (params: any) =>
  new Promise<[any, any]>((resolve) => {
    setTimeout(() => {
      resolve(['', []])
    }, 300)
  })
export function useTable(options: { filterObj: Ref<any> }) {
  const TableSFC = defineAsyncComponent(() => import('@/views/energyFee/common/components/Table2/index.vue'))
  const columns = ref([])
  const data = ref([])
  const loading = ref(false)
  const total = ref(0)
  const selectionRows = ref([])
  const page = ref({
    pageSize: 10,
    curPage: 1,
  })

  const filterObj = ref(
    Object.assign(
      {},
      {
        search: '',
      },
      options.filterObj.value,
    ),
  )

  const fetchData = async () => {
    loading.value = true
    const params = {
      ...page.value,
      ...filterObj.value,
    }
    const [error, res] = await getList(params)
    if (!error) {
      data.value = res
    }
    loading.value = false
  }

  fetchData()

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
