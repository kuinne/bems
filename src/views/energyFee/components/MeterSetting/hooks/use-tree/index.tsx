import { defineAsyncComponent, ref, toRaw } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { UseTreeOptions } from './type'
import { getMeterSettingTree } from '@/views/energyFee/apis'
import { Options } from '../../constants'
import { i18n } from '@/utils/i18n'

export function useTree(options?: UseTreeOptions) {
  const TreeSFC = defineAsyncComponent(() => import('./Tree.vue'))

  const treeData = ref<any[]>([])

  const energyTypeOptions = ref<Options<any>>([])

  const currentNodeKey = ref<number>()

  const initTreeData = async () => {
    const [error, data] = await getMeterSettingTree()

    if (!error) {
      treeData.value = data.map((item: any) => ({
        ...item,
        nameWithCount: `${item.name}(${item.count || 0})`,
      }))
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
    currentNodeKey.value = node.id
  }
  const Tree = () => <TreeSFC treeData={treeData.value} onNodeClick={handleNodeClick}></TreeSFC>
  return {
    Tree,
    energyTypeOptions,
    energyBillingSettingId: currentNodeKey,
  }
}
