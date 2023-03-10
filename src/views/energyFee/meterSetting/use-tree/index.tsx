import { DasTree } from '@/das-fe/ui'
import { onMounted, ref, watch } from 'vue'
import { getMeterSettingTree } from '@/views/energyFee/apis'

type DasTreeProps = InstanceType<typeof DasTree>['$props']

export function useTree() {
  const data = ref<DasTreeProps['data']>([])
  const loading = ref(false)

  const currentNodeKey = ref<string>('')
  const energyType = ref<any>({})
  const dasTreeRef = ref<InstanceType<typeof DasTree>>()
  const fetchData = async () => {
    loading.value = true
    const [error, res] = await getMeterSettingTree()
    if (!error) {
      data.value = res.map((item: any) => ({
        ...item,
        disabled: true,
      }))

      const hasChildItem = res.find((item: any) => item.children?.length > 0)

      if (hasChildItem) {
        currentNodeKey.value = hasChildItem.children[0].id
        energyType.value = hasChildItem
      } else {
        energyType.value = res[0]
      }
    }
    loading.value = false
  }

  watch(
    () => currentNodeKey.value,
    () => {
      const currentNode = dasTreeRef.value?.treeRef?.getNode(currentNodeKey.value)

      if (currentNode) {
        energyType.value = currentNode?.parent?.data
      }
    },
  )
  const Tree = () => (
    <DasTree ref={dasTreeRef} default-expand-all data={data.value} v-model={currentNodeKey.value}>
      {{
        default: ({ node, data }: any) => <div>{node.level === 1 ? data.name : `${data.name}(${data.count})`}</div>,
      }}
    </DasTree>
  )

  return {
    Tree,
    currentNodeKey,
    energyType,
    update: () => {
      fetchData()
    },
  }
}
