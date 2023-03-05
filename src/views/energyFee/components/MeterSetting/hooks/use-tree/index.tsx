import { defineAsyncComponent, ref, toRaw } from 'vue'

import type { UseTreeOptions } from './type'
import { getEnergyType } from '@/views/energyFee/apis'
import { Options } from '../../constants'
import { i18n } from '@/utils/i18n'

export function useTree(options?: UseTreeOptions) {
  const { onSearch } = options || {}
  const TreeSFC = defineAsyncComponent(() => import('./Tree.vue'))

  const treeData = ref<any[]>([])

  const energyTypeOptions = ref<Options<any>>([])

  const currentNodeKey = ref('')

  const initTreeData = async () => {
    const [error, data] = await getEnergyType()

    if (!error) {
      treeData.value = [
        {
          name: i18n('全部标准' as any).value,
          id: '-1',
          children: data.map((item: any) => ({
            ...item,
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

  const handleSearch = (keys: string[]) => {
    onSearch?.(keys)
  }
  initTreeData()

  const Tree = () => <TreeSFC treeData={treeData.value} onSearch={handleSearch}></TreeSFC>
  return {
    Tree,
    energyTypeOptions,
  }
}
