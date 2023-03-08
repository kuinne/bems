import { Confirm } from '@/views/energyFee/common/components/ConfirmDialog'
import { DasMessage } from '@/das-fe/ui'
import { ref } from 'vue'
import { pendingDecorator } from '@/views/energyFee/common/utils'

const remove = (ids: string[]) => {
  console.log('~~~~~~~remove', ids)

  return new Promise<[any, any]>((resolve) => {
    setTimeout(() => {
      resolve(['', 'ok'])
    }, 300)
  })
}
export function useDelete() {
  const title = '表记设置'
  const ids = ref<string[]>([])

  const confirm = async () => {
    const [error, data] = await remove(ids.value)
    if (!error) {
      DasMessage.success(`删除${title}成功`)
      return true
    } else {
      DasMessage.error(`删除${title}失败`, error)
      return false
    }
  }

  const open = async (_ids: string[]) => {
    ids.value = _ids
    await Confirm({
      content: '删除后将影响相关表计的计费<br/>确定删除吗？',
    })

    return confirm()
  }

  return {
    open: pendingDecorator(open),
  }
}
