import { DasMessage } from '@/das-fe/ui'
import { deleteSetting } from '@/views/energyFee/apis'
import { defineAsyncComponent, ref, toRaw } from 'vue'
import type { CharingSetting } from '../../type'
import type { UseDeleteOptions } from './type'
import { isArray } from '../../../../common/utils'

export function useDelete({ onConfirm }: UseDeleteOptions) {
  const ConfirmDialogSFC = defineAsyncComponent(() => import('../../../../common/components/ConfirmDialog/ConfirmDialog.vue'))

  const visible = ref(false)
  const formData = ref<CharingSetting | CharingSetting[]>()

  const handleClose = () => {
    visible.value = false
  }

  const handleConfirm = async () => {
    if (formData.value) {
      let ids: string[] = []
      if (isArray(formData.value)) {
        ids = formData.value.map((item) => item.id!)
      } else {
        ids.push(formData.value.id!)
      }
      const [error, data] = await deleteSetting({
        ids,
      })
      if (!error) {
        DasMessage.success('删除计费标准成功')
        handleClose()
      } else {
        DasMessage.error('删除计费标准失败', error)
      }
      onConfirm?.()
    }
  }

  const open = (val: CharingSetting | CharingSetting[]) => {
    formData.value = val
    visible.value = true
  }
  const Delete = () => <ConfirmDialogSFC visible={visible.value} content="删除后将影响相关表计的计费<br/>确定删除吗？" onClose={handleClose} onConfirm={handleConfirm}></ConfirmDialogSFC>
  return {
    Delete,
    open,
  }
}
