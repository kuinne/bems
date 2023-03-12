import { Confirm } from '@/views/energyFee/common/components/ConfirmDialog'
import { DasMessage } from '@/das-fe/ui'
import { deleteSetting } from '@/views/energyFee/apis'
import { pendingDecorator } from '@/views/energyFee/common/utils'
import type { Fn } from '@/views/energyFee/common/type'

export function useDelete() {
  const title = '计费标准'

  const open = async (payload: string[], callback?: Fn<any>) => {
    try {
      await Confirm({
        type: 'delete',
        title,
        content: '删除后将影响相关表计的计费<br/>确定删除吗？',
      })
      const [error, data] = await deleteSetting({
        ids: payload,
      })
      if (!error) {
        DasMessage.success(`删除${title}成功`)
        callback?.()
      } else {
        DasMessage.error(`删除${title}失败, ${error.msg}`)
      }
    } catch (error) {}
  }

  return {
    open,
  }
}
