import { defineAsyncComponent, ref, toRaw } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { UseTreeOptions } from './type'
import { getEnergyType } from '@/views/energyFee/apis'
import { Options } from '../../constants'
import { i18n } from '@/utils/i18n'

export function useTree(options?: UseTreeOptions) {
  const { onNodeClick } = options || {}
  const TreeSFC = defineAsyncComponent(() => import('./Tree.vue'))

  const treeData = ref<any[]>([])

  const energyTypeOptions = ref<Options<any>>([])

  const currentNodeKey = ref('')

  const initTreeData = async () => {
    const [error, data] = await getEnergyType()

    if (!error) {
      treeData.value = [
        {
          nameWithCount: i18n('全部标准' as any).value,
          id: '-1',
          children: data.map((item: any) => ({
            ...item,
            nameWithCount: `${item.name}(${item.count})`,
          })),
        },
      ]
      energyTypeOptions.value = data.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
      if (data[0]) {
        currentNodeKey.value = data[0].id
      }
    }
  }
  initTreeData()
  const handleNodeClick = (node: Node) => {
    onNodeClick?.(toRaw(node))
  }
  const Tree = () => <TreeSFC treeData={treeData.value} onNodeClick={handleNodeClick}></TreeSFC>
  return {
    Tree,
    energyTypeOptions,
  }
}
