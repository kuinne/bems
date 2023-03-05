import { inject, Ref, ref, onMounted, SetupContext } from 'vue'
import { DasMessage } from '@/das-fe/ui'
import { updateType } from '../apis'
import { isEmpty } from './common'
import { BasicEmits, editStatus, infoData } from '../hooks/index'
import BigNumber from 'bignumber.js'
interface updateReqObject {
  [key: string]: any
}
type ruleInfoValidateT = {
  typeNameError: string
  typeCodeError: string
  unitError: string
  tceValueError: string
  tValueError: string
  descError: string
}
type ruleInfoT = {
  id: any
  typeCode: any
  typeName: any
  unit: any
  // 折标煤系数
  tceValue: any
  // 折碳排放系数
  tValue: any
  desc: any
}
type editRelatedObj = {
  editStatus: Ref<string>
  ruleInfoValidate: Ref<ruleInfoValidateT>
  infoData: Ref<ruleInfoT>
  submitLoading: Ref<boolean>
  handleCancel: () => void
  submitForm: () => void
}

export const labelTips = {
  typeNameTips: '必填，最多20个字符/汉字，可以是任意字符，不可重复',
  typeCodeTips: '必填，最多20个字符，只可是字母、数字、下划线，不可重复',
  unitTips: '必填，最多10个字符/汉字，可以是任意字符',
  tceValueTips: '必填，只可是数字，最多10位整数+10位小数',
  tValueTips: '必填，只可是数字，最多10位整数+10位小数',
  descTips: '非必填，默认为空。可为任意字符，最多200个汉字/字符',
}

export const useEdit = (emit?: SetupContext<BasicEmits>['emit']): editRelatedObj => {
  // 详情
  let submitLoading = ref(false)
  let ruleInfoValidate = ref({
    typeNameError: '',
    typeCodeError: '',
    unitError: '',
    tceValueError: '',
    tValueError: '',
    descError: '',
  })
  // 保存
  const submitForm = async () => {
    const CODE_REG = /^[0-9a-zA-Z_]{1,20}$/
    const RATIO_REG = /^[0-9]{1,10}(\.[0-9]{1,10})?$/

    ruleInfoValidate.value.typeNameError = isEmpty(infoData.value.typeName) || infoData.value.typeName.length > 20 ? labelTips.typeNameTips : ''
    ruleInfoValidate.value.typeCodeError = isEmpty(infoData.value.typeCode) || !CODE_REG.test(infoData.value.typeCode) ? labelTips.typeCodeTips : ''
    ruleInfoValidate.value.unitError = isEmpty(infoData.value.unit) || infoData.value.unit.length > 10 ? labelTips.unitTips : ''
    ruleInfoValidate.value.tceValueError = isEmpty(infoData.value.tceValue) || !RATIO_REG.test(infoData.value.tceValue) ? labelTips.tceValueTips : ''
    ruleInfoValidate.value.tValueError = isEmpty(infoData.value.tValue) || !RATIO_REG.test(infoData.value.tValue) ? labelTips.tValueTips : ''
    ruleInfoValidate.value.descError = !isEmpty(infoData.value.desc) && infoData.value.desc.length > 200 ? labelTips.descTips : ''

    let key: keyof ruleInfoValidateT
    for (key in ruleInfoValidate.value) {
      if (ruleInfoValidate.value[key] !== '') return false
    }
    handleEditConfirm()
  }

  const handleEditConfirm = async () => {
    submitLoading.value = true
    let reqData: updateReqObject = {
      name: infoData.value.typeName,
      typeCode: infoData.value.typeCode,
      calUnit: infoData.value.unit,
      coalFactor: new BigNumber(infoData.value.tceValue),
      ceFactor: new BigNumber(infoData.value.tValue),
      description: infoData.value.desc,
    }
    if (editStatus.value === 'edit') {
      reqData.id = infoData.value.id
    }
    const [error, data] = await updateType(reqData).run()
    if (!error) {
      DasMessage.success(`${editStatus.value === 'add' ? '添加' : '编辑'}能源分类成功`)
      if (emit) {
        emit('closeDialog', true)
      }
    }
    submitLoading.value = false
  }
  const handleCancel = () => {
    if (emit) {
      emit('closeDialog')
    }
  }
  return {
    editStatus,
    infoData,
    ruleInfoValidate,
    submitLoading,
    handleCancel,
    submitForm,
  }
}
