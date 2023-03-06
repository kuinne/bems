import { createSetting, updateSetting } from '@/views/energyFee/apis'
import { isUndef } from '@/views/energyFee/common/utils'
import { defineAsyncComponent, ref, computed, watch, toRaw } from 'vue'
import { BillingMethod } from '../../enums'

import { charingTypeOptions } from '../../constants'
import { DasMessage } from '@/das-fe/ui'
import type { UseAddOptions } from './type'
import type { CharingSetting } from '../../type'

const getDefaultFormData = (): CharingSetting => {
  return {
    name: '',
    energyTypeId: '1',
    billingMethod: BillingMethod.Fixed,
    unitPrice: '0.1',
    remark: '',
    unitPriceDtos: [],
  }
}

export function useAdd({ onSubmit, energyTypeOptions }: UseAddOptions) {
  const EditDialogSFC = defineAsyncComponent(() => import('../../../../common/components/EditDialog/EditDialog.vue'))

  type EditDialogProps = InstanceType<typeof EditDialogSFC>['$props']
  const visible = ref(false)
  const DECIMAL_REG = /^[0-9]{1,10}(\.[0-9]{1,10})?$/

  const formData = ref<CharingSetting>(getDefaultFormData())

  const dialogType = ref<EditDialogProps['type']>('view')

  const formItems = computed<EditDialogProps['formItems']>(() => {
    const priceFormItem: EditDialogProps['formItems'][number] = {
      prop: 'unitPrice',
      label: '单价(元)',
      required: true,
      type: 'input',
      col: 1,
      isRight: true,
      validator: (val?: string) => {
        if (isUndef(val) || !DECIMAL_REG.test(val as string)) {
          return '必填，数值，可以为小数，整数位最多10位，小数位最多10位'
        }
      },
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

  const add = async () => {
    const [error, data] = await createSetting(toRaw(formData.value))

    if (!error) {
      DasMessage.success('新增计费标准成功')
      onSubmit?.()
      handleClose()
    } else {
      DasMessage.error('新增计费标准失败', error)
    }
  }

  const edit = async () => {
    const [error, data] = await updateSetting(toRaw(formData.value))

    if (!error) {
      DasMessage.success('编辑计费标准成功')
      onSubmit?.()
      handleClose()
    } else {
      DasMessage.error('编辑计费标准失败', error)
    }
  }

  const handleSubmit = async () => {
    switch (dialogType.value) {
      case 'add':
        add()
        return
      case 'edit':
        edit()
        return
    }
  }
  const resetFormData = () => {
    formData.value = getDefaultFormData()
  }
  const handleClose = () => {
    visible.value = false
    resetFormData()
  }

  const Add = () => (
    <EditDialogSFC title="计费标准" type={dialogType.value} visible={visible.value} formData={formData.value} formItems={formItems.value} onSubmit={handleSubmit} onClose={handleClose} />
  )

  const open = (type: EditDialogProps['type'], _formData?: any) => {
    dialogType.value = type
    if (_formData) {
      formData.value = JSON.parse(JSON.stringify(_formData))
    }
    visible.value = true
  }
  return {
    Add,
    open,
  }
}
