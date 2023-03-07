import { DasTree } from '@/das-fe/ui'
import { ref, watchEffect } from 'vue'
import { getEnergyType } from '@/views/energyFee/apis'
const mockData = [
  {
    id: '1',
    name: 'ffff',
    children: [
      {
        id: '1-1',
        name: 'fdsfsd',
      },
    ],
  },
  {
    id: '2',
    name: '得到的',
  },
]
const getTree = () => {
  return new Promise<[any, any]>((resolve) => {
    setTimeout(() => {
      resolve(['', mockData])
    }, 300)
  })
}

export function useTree() {
  const data = ref<any>([])
  const loading = ref(false)
  const currentNodeKey = ref<string>('-1')
  const energyTypeOptions = ref<any>()
  const fetchData = async () => {
    loading.value = true
    const [error, res] = await getEnergyType()
    if (!error) {
      data.value = [
        {
          name: '全部标准',
          id: '-1',
          children: res,
        },
      ]
      energyTypeOptions.value = res.map((item) => ({
        value: item.id,
        label: item.name,
      }))
    }
    loading.value = false
  }

  const Tree = () => <DasTree default-expand-all={false} data={data.value} v-model={currentNodeKey.value}></DasTree>
  fetchData()
  return {
    Tree,
    currentNodeKey,
    energyTypeOptions,
  }
}
