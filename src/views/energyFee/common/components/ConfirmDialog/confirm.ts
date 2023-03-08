import { createVNode, render } from 'vue'
import ConfirmDialogConstructor from './ConfirmDialog.vue'

const initInstance = (props: any, container: HTMLElement) => {
  const vnode = createVNode(ConfirmDialogConstructor, props)

  render(vnode, container)
  document.body.appendChild(container)
  return vnode.component!
}
export const confirm = (props: InstanceType<typeof ConfirmDialogConstructor>['$props']): Promise<'close' | 'confirm'> => {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div')

    const destroy = () => {
      render(null, container)
    }

    const options = {
      ...props,
      onClose: () => {
        reject('close')
        destroy()
      },
      onConfirm: () => {
        resolve('confirm')
        destroy()
      },
    }
    const instance = initInstance(options, container)
    const vm = instance as any

    vm.props.visible = true

    return vm
  })
}
