import { ref, Ref, watch } from 'vue'
import {} from '@/utils/api-services'
import { Fn } from '../type'

export type useFetchListOptions<DataItem, Params> = {
  fetcher: (params: Params) => Promise<
    [
      any,
      {
        records: DataItem[]
        total: number
      },
    ]
  >
  filterObj: Ref<Params>
  defaultFilterObj: any
}
export function useFetchList<DataItem, Params>(options: useFetchListOptions<DataItem, Params>) {
  const loading = ref(false)
  const total = ref(0)
  const data = ref<DataItem[]>([]) as Ref<DataItem[]>
  const curPage = ref(0)
  const pageSize = ref(20)
  const filterObj = ref<Params>(options.defaultFilterObj)

  const run = async () => {
    if (!filterObj.value.energyBillingSettingId) return

    console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡 meterSetting/use-table-fetchData', filterObj.value)

    loading.value = true
    data.value = []
    const [error, res] = await options.fetcher({
      pageIndex: curPage.value,
      pageSize: pageSize.value,
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
    () => [pageSize.value, curPage.value],
    () => {
      run()
    },
  )
  watch(
    () => filterObj.value,
    (val: any, oldVal: any) => {
      if (JSON.stringify(val) === JSON.stringify(oldVal)) return
      run()
    },
    {
      deep: true,
    },
  )

  return {
    loading,
    data,
    total,
    run,
    curPage,
    pageSize,
  }
}
