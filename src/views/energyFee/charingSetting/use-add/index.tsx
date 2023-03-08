import { EditDialog } from '@/views/energyFee/common/components/EditDialog'
import type { EditDialogProps } from '@/views/energyFee/common/components/EditDialog'
import { DasMessage } from '@/das-fe/ui'
import { charingTypeOptions } from '@/views/energyFee/charingSetting/constants'
import { isUndef } from '@/views/energyFee/common/utils'
import { BillingMethod } from '@/views/energyFee/charingSetting/enums'
import { createSetting, updateSetting } from '@/views/energyFee/apis'
import { ref, computed, Ref } from 'vue'
import { useEditableTable } from '../use-editable-table'
import { Edit } from '@/views/energyFee/common/components/EditDialog'
import { pendingDecorator } from '@/views/energyFee/common/utils'

const DECIMAL_REG = /^[0-9]{1,10}(\.[0-9]{1,10})?$/

export function useAdd({ energyTypeOptions }: { energyTypeOptions: Ref<any> }) {
  const title = '计费标准'
  const dialogType = ref<EditDialogProps['type']>('view')

  const formItems = computed<EditDialogProps['formItems']>(() => {
    const priceFormItem: EditDialogProps['formItems'][number] = (formData: typeof initFormData.value) => {
      const base = {
        prop: 'unitPrice',
        label: '单价(元)',
        required: true,
      }
      if (formData.billingMethod === BillingMethod.Time) {
        return {
          ...base,
          col: 4,
          type: 'custom',
          render: () => <div>fsdfsdf</div>,
          validator: () => 'fsdfdsfdsfsdf',
        }
      }
      return {
        ...base,
        type: 'input',
        col: 1,
        isRight: true,
        validator: (val?: string) => {
          if (isUndef(val) || !DECIMAL_REG.test(val as string)) {
            return '必填，数值，可以为小数，整数位最多10位，小数位最多10位'
          }
        },
      }
    }
    return [
      {
        prop: 'name',
        label: '计费标准',
        required: true,
        type: 'input',
        maxlength: 20,
        col: 1,
        validator: (val?: string) => {
          if (!val) {
            return '必填，同一项目下不能重复，限20字'
          }
        },
      },
      {
        prop: 'energyTypeId',
        label: '能源分类',
        type: 'select',
        required: true,
        options: energyTypeOptions.value,
        col: 1,
      },
      {
        prop: 'billingMethod',
        label: '计费方式',
        type: 'select',
        required: true,
        options: charingTypeOptions,
        col: 1,
      },
      priceFormItem,

      {
        prop: 'remark',
        label: '备注',
        type: 'textarea',
        col: 4,
        maxlength: 200,
        showWordLimit: true,
        isRight: true,
      },
    ]
  })

  const initFormData = computed(() => ({
    name: '',
    energyTypeId: energyTypeOptions.value[0]?.value,
    billingMethod: charingTypeOptions[0]?.value,
    unitPriceDtos: '',
    remark: '',
  }))

  const add = async (params: any) => {
    const [error, data] = await createSetting(params)

    if (!error) {
      DasMessage.success(`新增${title}成功`)
      return true
    } else {
      DasMessage.error(`新增${title}失败`, error)
      return false
    }
  }

  const edit = async (params: any) => {
    const [error, data] = await updateSetting(params)

    if (!error) {
      DasMessage.success(`编辑${title}成功`)
      return true
    } else {
      DasMessage.error(`编辑${title}失败`, error)
      return false
    }
  }
  const submit = async (data: any) => {
    const newFormData = await Edit({
      title,
      type: dialogType.value,
      formData: data,
      formItems: formItems.value,
    })
    switch (dialogType.value) {
      case 'add':
        return add(newFormData)
      case 'edit':
        return edit(newFormData)
      case 'view':
        return false
    }
  }

  function open(type: EditDialogProps['type'], data?: any): Promise<boolean> {
    if (type === 'add') {
      data = initFormData.value
    }
    dialogType.value = type

    return submit(data)
  }

  return {
    open: pendingDecorator(open),
  }
}

// export function useAdd({ energyTypeOptions }: { energyTypeOptions: Ref<any> }) {
//   const title = '计费标准'
//   const visible = ref<EditDialogProps['visible']>(false)
//   const dialogType = ref<EditDialogProps['type']>('view')

//   const formData = ref<EditDialogProps['formData']>({})
//   const { EditableTable, validator: editableValidator } = useEditableTable({
//     formData,
//     isView: computed(() => dialogType.value === 'view'),
//   })
//   const formItems = computed<EditDialogProps['formItems']>(() => {
//     const priceFormItem: EditDialogProps['formItems'][number] = {
//       prop: 'unitPrice',
//       label: '单价(元)',
//       required: true,
//       type: 'input',
//       col: 1,
//       isRight: true,
//       validator: (val?: string) => {
//         if (isUndef(val) || !DECIMAL_REG.test(val as string)) {
//           return '必填，数值，可以为小数，整数位最多10位，小数位最多10位'
//         }
//       },
//     }

//     if (formData.value.billingMethod === BillingMethod.Time) {
//       priceFormItem.prop = 'unitPriceDtos'
//       priceFormItem.col = 4
//       priceFormItem.type = 'custom'
//       priceFormItem.render = () => <EditableTable />
//       priceFormItem.validator = editableValidator
//     }
//     return [
//       {
//         prop: 'name',
//         label: '计费标准',
//         required: true,
//         type: 'input',
//         maxlength: 20,
//         col: 1,
//         validator: (val?: string) => {
//           if (!val) {
//             return '必填，同一项目下不能重复，限20字'
//           }
//         },
//       },
//       {
//         prop: 'energyTypeId',
//         label: '能源分类',
//         type: 'select',
//         required: true,
//         options: energyTypeOptions.value,
//         col: 1,
//       },
//       {
//         prop: 'billingMethod',
//         label: '计费方式',
//         type: 'select',
//         required: true,
//         options: charingTypeOptions,
//         col: 1,
//       },
//       priceFormItem,

//       {
//         prop: 'remark',
//         label: '备注',
//         type: 'textarea',
//         col: 4,
//         maxlength: 200,
//         showWordLimit: true,
//         isRight: true,
//       },
//     ]
//   })

//   let resolve: any

//   const add = async () => {
//     const [error, data] = await createSetting(formData.value)

//     if (!error) {
//       DasMessage.success(`新增${title}成功`)
//       resolve?.(true)
//       visible.value = false
//     } else {
//       DasMessage.error(`新增${title}失败`, error)
//     }
//   }

//   const edit = async () => {
//     const [error, data] = await updateSetting(formData.value)

//     if (!error) {
//       DasMessage.success(`编辑${title}成功`)
//       resolve?.(true)
//       visible.value = false
//     } else {
//       DasMessage.error(`编辑${title}失败`, error)
//     }
//   }
//   const handleSubmit = async (data: any) => {
//     formData.value = data
//     switch (dialogType.value) {
//       case 'add':
//         add()
//         return
//       case 'edit':
//         edit()
//         return
//     }
//   }

//   const handleClose = () => {
//     visible.value = false
//     resolve?.(false)
//   }

//   const render = () => <EditDialog title={title} visible={visible.value} type={dialogType.value} formData={formData.value} formItems={formItems.value} onSubmit={handleSubmit} onClose={handleClose} />

//   const open = (type: EditDialogProps['type'], data?: any) => {
//     if (data) {
//       formData.value = JSON.parse(JSON.stringify(data))
//     }
//     dialogType.value = type
//     visible.value = true
//     if (type === 'view') {
//       return Promise.resolve(false)
//     } else {
//       return new Promise<boolean>((r) => {
//         resolve = r
//       })
//     }
//   }

//   return {
//     Add: render,
//     open,
//   }
// }
