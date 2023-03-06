import { EditDialog } from '@/views/energyFee/common/components/EditDialog'
import type { EditDialogProps } from '@/views/energyFee/common/components/EditDialog'
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
  const title = '用户设置'
  const visible = ref<EditDialogProps['visible']>(false)
  const dialogType = ref<EditDialogProps['type']>('view')
  const formData = ref<EditDialogProps['formData']>({})
  const formItems = ref<EditDialogProps['formItems']>([
    {
      prop: 'name',
      label: '姓名',
      required: true,
      type: 'input',
      col: 1,
      validator: (val?: string) => {
        if (!val) {
          return '必填，同一项目下不能重复，限20字'
        }
      },
    },
    {
      prop: 'age',
      label: '年龄',
      required: true,
      type: 'input',
      col: 1,
    },
    {
      prop: 'status',
      label: '状态',
      required: true,
      type: 'select',
      options: [
        {
          label: '成功',
          value: 1,
        },
        {
          label: '失败',
          value: 2,
        },
      ],
    },
  ])

  let resolve: any

  const add = async () => {
    const [error, data] = await create(formData.value)

    if (!error) {
      DasMessage.success(`新增${title}成功`)
      resolve?.(true)
      visible.value = false
    } else {
      DasMessage.error(`新增${title}失败`, error)
    }
  }

  const edit = async () => {
    const [error, data] = await update(formData.value)

    if (!error) {
      DasMessage.success(`编辑${title}成功`)
      resolve?.(true)
      visible.value = false
    } else {
      DasMessage.error(`编辑${title}失败`, error)
    }
  }
  const handleSubmit = async (data: any) => {
    formData.value = data
    switch (dialogType.value) {
      case 'add':
        add()
        return
      case 'edit':
        edit()
        return
    }
  }

  const handleClose = () => {
    visible.value = false
    resolve?.(false)
  }

  const render = () => <EditDialog title={title} visible={visible.value} type={dialogType.value} formData={formData.value} formItems={formItems.value} onSubmit={handleSubmit} onClose={handleClose} />

  const open = (type: EditDialogProps['type'], data?: any) => {
    if (data) {
      formData.value = JSON.parse(JSON.stringify(data))
    }
    dialogType.value = type
    visible.value = true
    if (type === 'view') {
      return Promise.resolve(false)
    } else {
      return new Promise((r) => {
        resolve = r
      })
    }
  }

  return {
    Add: render,
    open,
  }
}
