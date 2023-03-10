import { DasTree } from '@/das-fe/ui'

import { computed, onActivated, ref } from 'vue'
import { getEnergyType } from '@/views/energyFee/apis'

export function useTree() {
  const dasTreeRef = ref<InstanceType<typeof DasTree>>()
  const data = ref<any[]>([
    {
      name: '全部标准',
      id: '-1',
      children: [],
    },
  ])
  const loading = ref(false)
  const currentNodeKey = ref<string>(data.value[0].id)
  const fetchData = async () => {
    loading.value = true
    const [error, res] = await getEnergyType()
    if (!error) {
      data.value[0].children = res
    }
    loading.value = false
  }

  const currentNode = computed(() => dasTreeRef.value?.treeRef?.getCurrentNode() || data.value[0])

  const Tree = () => (
    <DasTree ref={dasTreeRef} default-expand-all data={data.value} v-model={currentNodeKey.value}>
      {{
        default: ({ node, data }: any) => <div>{node.level === 1 ? data.name : `${data.name}(${data.count})`}</div>,
      }}
    </DasTree>
  )

  return {
    Tree,
    currentNode,
    update: () => {
      fetchData()
    },
  }
}
