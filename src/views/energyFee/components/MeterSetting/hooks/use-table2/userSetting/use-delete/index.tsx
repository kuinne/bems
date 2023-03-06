import { ConfirmDialog } from '@/views/energyFee/common/components/ConfirmDialog'
import type { ConfirmDialogProps } from '@/views/energyFee/common/components/ConfirmDialog'
import { DasMessage } from '@/das-fe/ui'
import { ref } from 'vue'

const remove = (ids: string[]) => {
  console.log('~~~~~~~remove', ids)

  return new Promise<[any, any]>((resolve) => {
    setTimeout(() => {
      resolve(['', 'ok'])
    }, 300)
  })
}
export function useDelete() {
  const title = '用户设置'
  const visible = ref<ConfirmDialogProps['visible']>(false)
  const ids = ref<string[]>([])
  let resolve: any
  const open = (_ids: string[]) => {
    ids.value = _ids
    visible.value = true
    return new Promise((r) => {
      resolve = r
    })
  }
  const handleClose = () => {
    visible.value = false
    resolve?.(false)
  }

  const handleConfirm = async () => {
    const [error, data] = await remove(ids.value)
    if (!error) {
      DasMessage.success(`删除${title}成功`)
      resolve?.(true)
      visible.value = false
    } else {
      DasMessage.error(`删除${title}失败`, error)
    }
  }
  const render = () => <ConfirmDialog visible={visible.value} onClose={handleClose} onConfirm={handleConfirm} content="删除后将影响相关表计的计费<br/>确定删除吗？" />
  return {
    Delete: render,
    open,
  }
}
