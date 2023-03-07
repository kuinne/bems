import { AddDialog } from './AddDialog'
import type { AddDialogProps } from './AddDialog'
import { DasMessage } from '@/das-fe/ui'
import { ref } from 'vue'

const create = (params: any) => {
  console.log('~~~~~~~~~~~~create', params)

  return new Promise<[any, any]>((resolve) => {
    setTimeout(() => {
      resolve(['', 'ok'])
    }, 300)
  })
}
const update = (params: any) => {
  console.log('~~~~~~~~~update', params)

  return new Promise<[any, any]>((resolve) => {
    setTimeout(() => {
      resolve(['', 'ok'])
    }, 300)
  })
}

export function useAdd() {
  const title = '表计'
  const visible = ref<AddDialogProps['visible']>(false)

  const formData = ref<any>()

  let resolve: any

  const handleSubmit = async (data: any) => {
    formData.value = data
    const [error] = await create(formData.value)

    if (!error) {
      DasMessage.success(`新增${title}成功`)
      resolve?.(true)
      visible.value = false
    } else {
      DasMessage.error(`新增${title}失败`, error)
    }
  }

  const handleClose = () => {
    visible.value = false
    resolve?.(false)
  }

  const render = () => <AddDialog title={title} visible={visible.value} type={'add'} onSubmit={handleSubmit} onClose={handleClose} />

  const open = () => {
    visible.value = true
    return new Promise((r) => {
      resolve = r
    })
  }

  return {
    Add: render,
    open,
  }
}
