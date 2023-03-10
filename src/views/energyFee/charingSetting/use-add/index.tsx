import { EditDialog } from '@/views/energyFee/common/components/EditDialog'
import type { EditDialogProps } from '@/views/energyFee/common/components/EditDialog'
import { DasMessage } from '@/das-fe/ui'
import { charingTypeOptions } from '@/views/energyFee/charingSetting/constants'
import { isUndef } from '@/views/energyFee/common/utils'
import { BillingMethod } from '@/views/energyFee/charingSetting/enums'
import { createSetting, updateSetting, getAllEnergyType, viewSetting } from '@/views/energyFee/apis'
import { ref, computed, Ref, onMounted } from 'vue'
import { useEditableTable } from '../use-editable-table'
import type { Fn, Options } from '@/views/energyFee/common/type'

const DECIMAL_REG = /^[0-9]{1,10}(\.[0-9]{1,10})?$/

export function useAdd({ currentEnergyType }: { currentEnergyType: Ref<any> }) {
  const title = '计费标准'
  const visible = ref<EditDialogProps['visible']>(false)
  const dialogType = ref<EditDialogProps['type']>('view')

  const energyTypeOptions = ref<Options<any>>([])

  const fetchEnergyType = async () => {
    const [error, data] = await getAllEnergyType()
    if (!error) {
      energyTypeOptions.value = data.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    }
  }

  const fetchData = async (params: { id: string }) => {
    const [error, data] = await viewSetting(params)
    if (!error) {
      return data
    }
    return null
  }
  const formData = ref<EditDialogProps['formData']>({})
  const { EditableTable, validator: editableValidator } = useEditableTable({
    formData,
    isView: computed(() => dialogType.value === 'view'),
  })
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

    if (formData.value.billingMethod === BillingMethod.Time) {
      priceFormItem.prop = 'unitPriceDtos'
      priceFormItem.col = 4
      priceFormItem.type = 'custom'
      priceFormItem.render = () => <EditableTable />
      priceFormItem.validator = editableValidator
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
        disabled: dialogType.value === 'edit',
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
        autosize: true,
      },
    ]
  })

  let resolve: any

  const add = async () => {
    const [error, data] = await createSetting(formData.value)

    if (!error) {
      DasMessage.success(`新增${title}成功`)
      resolve?.(true)
      visible.value = false
    }
  }

  const edit = async () => {
    const [error, data] = await updateSetting(formData.value)

    if (!error) {
      DasMessage.success(`编辑${title}成功`)
      resolve?.(true)
      visible.value = false
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
  }

  const initFormData = computed(() => ({
    name: '',
    energyTypeId: currentEnergyType.value.id === '-1' ? energyTypeOptions.value[0]?.value : currentEnergyType.value.id,
    billingMethod: charingTypeOptions[0]?.value,
    unitPrice: '',
    remark: '',
    unitPriceDtos: [],
  }))

  const render = () => <EditDialog title={title} visible={visible.value} type={dialogType.value} formData={formData.value} formItems={formItems.value} onSubmit={handleSubmit} onClose={handleClose} />
  const open = (type: EditDialogProps['type'], payload?: any, callback?: Fn<any>) => {
    const inner = async () => {
      if (payload) {
        const data = await fetchData({ id: payload.id })
        if (data) {
          formData.value = JSON.parse(
            JSON.stringify({
              ...data,
              unitPriceDtos: data.unitPriceDtos || [],
            }),
          )
        }
      } else {
        formData.value = JSON.parse(JSON.stringify(initFormData.value))
      }
      dialogType.value = type
      visible.value = true
      return new Promise((r) => {
        resolve = r
      })
    }
    return inner().then(() => {
      callback?.()
    })
  }

  onMounted(() => {
    fetchEnergyType()
  })

  return {
    Add: render,
    open,
  }
}
