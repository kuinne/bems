import { ConfirmDialog } from '@/views/energyFee/common/components/ConfirmDialog'
import type { ConfirmDialogProps } from '@/views/energyFee/common/components/ConfirmDialog'
import { DasMessage } from '@/das-fe/ui'
import { deleteSetting } from '@/views/energyFee/apis'
import { ref } from 'vue'

type Fn<T = any> = (...args: any[]) => T

const waitConfirm = ({ onOpen, onConfirm }: { onOpen: Fn; onConfirm: Fn<Promise<boolean>> }) => {
  let resolve: Fn
  return {
    open: () => {
      onOpen()
      return new Promise((r) => {
        resolve = r
      })
    },
    confirm: async () => {
      const shouldResolved = await onConfirm()
      if (shouldResolved) {
        resolve(true)
      }
    },
  }
}

export function useDelete() {
  const title = '计费标准'
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
    const [error, data] = await deleteSetting({
      ids: ids.value,
    })
    if (!error) {
      DasMessage.success(`删除${title}成功`)
      resolve?.(true)
      visible.value = false
    } else {
      DasMessage.error(`删除${title}失败`, error)
    }
  }

  const {} = waitConfirm({
    onOpen: (_ids: string[]) => {
      ids.value = _ids
      visible.value = true
    },
    onConfirm: async () => {
      const [error, data] = await deleteSetting({
        ids: ids.value,
      })
      if (!error) {
        DasMessage.success(`删除${title}成功`)
        visible.value = false
        return true
      } else {
        DasMessage.error(`删除${title}失败`, error)
        return false
      }
    },
  })
  const render = () => <ConfirmDialog visible={visible.value} onClose={handleClose} onConfirm={handleConfirm} content="删除后将影响相关表计的计费<br/>确定删除吗？" />
  return {
    Delete: render,
    open,
  }
}

// export function useDelete() {
//   const title = '计费标准'
//   const visible = ref<ConfirmDialogProps['visible']>(false)
//   const ids = ref<string[]>([])
//   let resolve: any
//   const open = (_ids: string[]) => {
//     ids.value = _ids
//     visible.value = true
//     return new Promise((r) => {
//       resolve = r
//     })
//   }
//   const handleClose = () => {
//     visible.value = false
//     resolve?.(false)
//   }

//   const handleConfirm = async () => {
//     const [error, data] = await deleteSetting({
//       ids: ids.value,
//     })
//     if (!error) {
//       DasMessage.success(`删除${title}成功`)
//       resolve?.(true)
//       visible.value = false
//     } else {
//       DasMessage.error(`删除${title}失败`, error)
//     }
//   }
//   const render = () => <ConfirmDialog visible={visible.value} onClose={handleClose} onConfirm={handleConfirm} content="删除后将影响相关表计的计费<br/>确定删除吗？" />
//   return {
//     Delete: render,
//     open,
//   }
// }
