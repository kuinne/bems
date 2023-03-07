import { DasTree } from '@/das-fe/ui'
import { ref } from 'vue'
import { getMeterSettingTree } from '@/views/energyFee/apis'

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
