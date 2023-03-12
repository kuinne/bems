import { Confirm } from '@/views/energyFee/common/components/ConfirmDialog'
import { DasMessage } from '@/das-fe/ui'

import { deleteMeterSetting } from '@/views/energyFee/apis'
import { Fn } from '../../../common/type'

export function useDelete() {
  const title = '表记设置'

  const open = async (ids: string[], callback?: Fn<any>) => {
    await Confirm({
      type: 'delete',
      content: '删除后将无法恢复<br/>确认是否删除？',
    })
    const [error, data] = await deleteMeterSetting({
      ids,
    })
    if (!error) {
      DasMessage.success(`删除${title}成功`)
      callback?.()
    } else {
      DasMessage.error(`删除${title}失败，${error.msg}`)
    }
  }

  return {
    open,
  }
}
