import { DasTree } from '@/das-fe/ui'
import { ref, watchEffect } from 'vue'
import { getMeterSettingTree } from '@/views/energyFee/apis'
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
  const currentNodeKey = ref<string>('')
  const fetchData = async () => {
    loading.value = true
    const [error, res] = await getMeterSettingTree()
    if (!error) {
      data.value = res
      currentNodeKey.value = res[0].id
    }
    loading.value = false
  }

  fetchData()
  const Tree = () => <DasTree data={data.value} v-model={currentNodeKey.value}></DasTree>

  return {
    Tree,
    currentNodeKey,
  }
}
