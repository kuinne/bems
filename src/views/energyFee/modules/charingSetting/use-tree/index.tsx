import { DasTree, DasSpin } from '@/das-fe/ui'

import { computed, onActivated, ref } from 'vue'
import { getEnergyType } from '@/views/energyFee/apis'
import styles from './style.module.scss'

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
    console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡 charingSetting/use-tree/fetchData')
    loading.value = true
    const [error, res] = await getEnergyType()
    loading.value = false
    if (!error) {
      data.value[0].children = res
    }
  }

  const currentNode = computed(() => dasTreeRef.value?.treeRef?.getCurrentNode() || data.value[0])

  const Tree = () => (
    <DasSpin full spinning={loading.value}>
      <DasTree class={styles['tree-container']} ref={dasTreeRef} default-expand-all data={data.value} v-model={currentNodeKey.value}>
        {{
          default: ({ node, data }: any) => <div>{node.level === 1 ? data.name : `${data.name}(${data.count})`}</div>,
        }}
      </DasTree>
    </DasSpin>
  )

  return {
    Tree,
    currentNode,
    update: () => {
      fetchData()
    },
  }
}
