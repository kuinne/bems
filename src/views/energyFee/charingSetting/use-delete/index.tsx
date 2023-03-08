import { Confirm } from '@/views/energyFee/common/components/ConfirmDialog'
import { DasMessage } from '@/das-fe/ui'
import { deleteSetting } from '@/views/energyFee/apis'
import { pendingDecorator } from '@/views/energyFee/common/utils'
import { ref } from 'vue'

export function useDelete() {
  const title = '计费标准'
  const ids = ref<string[]>([])

  const confirm = async () => {
    const [error, data] = await deleteSetting({
      ids: ids.value,
    })

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
      title,
      content: '删除后将影响相关表计的计费<br/>确定删除吗？',
    })
    return confirm()
  }

  return {
    open: pendingDecorator(open),
  }
}
