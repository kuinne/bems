import { createVNode, render } from 'vue'
import ComponentConstructor from './EditDialog.vue'

const initInstance = (props: any, container: HTMLElement) => {
  const vnode = createVNode(ComponentConstructor, props)

  render(vnode, container)
  document.body.appendChild(container)
  return vnode.component!
}
export const Edit = (props: Omit<InstanceType<typeof ComponentConstructor>['$props'], 'visible'>): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
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
      onSubmit: (formData: any) => {
        resolve(formData)
        destroy()
      },
    }
    const instance = initInstance(options, container)
    const vm = instance as any

    vm.props.visible = true

    return vm
  })
}
