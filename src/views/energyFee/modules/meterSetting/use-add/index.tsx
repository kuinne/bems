// import { AddDialog } from './AddDialog'
import AddDialog from './AddDialog/test'
import type { AddDialogProps } from './AddDialog'
import { DasMessage } from '@/das-fe/ui'
import { Ref, ref, watchEffect } from 'vue'
import { addMeterSetting } from '@/views/energyFee/apis'
import { Fn } from '../../../common/type'

console.log('AddDialog', AddDialog)

export function useAdd({ energyType, energyBillingSettingId }: { energyType: Ref<any>; energyBillingSettingId: Ref<string> }) {
  const title = '添加表计'
  const visible = ref<AddDialogProps['visible']>(false)

  let resolve: any

  const handleSubmit = async (data: any) => {
    const params = {
      meterId: data,
      energyBillingSettingId: energyBillingSettingId.value,
    }

    const [error] = await addMeterSetting(params)

    if (!error) {
      DasMessage.success(`新增${title}成功`)
      resolve?.(true)
      visible.value = false
    } else {
      DasMessage.error(`新增${title}失败，${error.msg}`)
    }
  }

  const handleClose = () => {
    visible.value = false
  }

  const render = () => {
    return <AddDialog visible={visible.value} energyType={energyType.value} onSubmit={handleSubmit} onClose={handleClose} />
  }

  const open = (callback?: Fn<any>) => {
    const inner = () => {
      visible.value = true
      return new Promise((r) => {
        resolve = r
      })
    }
    return inner().then(() => {
      callback?.()
    })
  }

  return {
    Add: render,
    open,
  }
}
