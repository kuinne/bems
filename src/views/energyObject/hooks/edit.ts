import { inject, Ref, ref, onMounted, SetupContext } from 'vue'
import { DasMessage } from '@/das-fe/ui'
import { addOrUpdateObject } from '../apis'
import { isEmpty, objAssign } from './common'
import { BasicEmits, editStatus, infoData } from './index'
import { projectId } from '../apis'
import BigNumber from 'bignumber.js'
interface updateReqObject {
  [key: string]: any
}
type objInfoValidateT = {
  objectNameError: string
  objectCodeError: string
  enableError: string
  structureAreaError: string
  settledStructureAreaError: string
  coldAreaError: string
  settledColdAreaError: string
  warmAreaError: string
  settledWarmAreaError: string
  residentsError: string
  pictureUrlError: string
  descriptionError: string
}

type editObjRelatedObj = {
  editStatus: Ref<string>
  ruleInfoValidate: Ref<objInfoValidateT>
  infoData: Ref<any>
  submitLoading: Ref<boolean>
  handleCancel: () => void
  submitForm: () => void
  changeImage: () => void
}

export const labelTips = {
  objectNameTips: '必填，最多20个字符/汉字，可以是任意字符，同一项目、同一层级下不可重复',
  objectCodeTips: '必填，最多20个字符，只可是字母、数字、下划线，同一租户下不可重复',
  structureAreaTips: '非必填，只可是大于等于0的整数',
  settledStructureAreaTips: '非必填，只可是大于等于0的整数',
  coldAreaTips: '非必填，只可是大于等于0的整数',
  settledColdAreaTips: '非必填，只可是大于等于0的整数',
  warmAreaTips: '非必填，只可是大于等于0的整数',
  settledWarmAreaTips: '非必填，只可是大于等于0的整',
  residentsTips: '非必填，只可是大于等于0的整数',
  pictureUrlTips: '必填，只支持png、jpg格式，最佳分辨率为270*180',
  descriptionTips: '非必填，最多200个字符/汉字，可以是任意字符',
}

export const useEditObject = (emit: SetupContext<BasicEmits>['emit']): editObjRelatedObj => {
  // 详情
  if (infoData.value && editStatus.value === 'edit') {
    infoData.value.id = infoData.value.id
  }
  let submitLoading = ref(false)
  let ruleInfoValidate = ref({
    objectNameError: '',
    objectCodeError: '',
    enableError: '',
    structureAreaError: '',
    settledStructureAreaError: '',
    coldAreaError: '',
    settledColdAreaError: '',
    warmAreaError: '',
    settledWarmAreaError: '',
    residentsError: '',
    pictureUrlError: '',
    descriptionError: '',
  })
  // 保存
  const submitForm = async () => {
    const CODE_REG = /^[0-9a-zA-Z_]{1,20}$/
    const INT_REG = /^\d{1,10}$/

    ruleInfoValidate.value.objectNameError = isEmpty(infoData.value.objectName) || infoData.value.objectName.length > 20 ? labelTips.objectNameTips : ''
    ruleInfoValidate.value.objectCodeError = isEmpty(infoData.value.objectCode) || !CODE_REG.test(infoData.value.objectCode) ? labelTips.objectCodeTips : ''
    ruleInfoValidate.value.structureAreaError = !isEmpty(infoData.value.structureArea) && !INT_REG.test(infoData.value.structureArea) ? labelTips.structureAreaTips : ''
    ruleInfoValidate.value.settledStructureAreaError = !isEmpty(infoData.value.settledStructureArea) && !INT_REG.test(infoData.value.settledStructureArea) ? labelTips.settledStructureAreaTips : ''
    ruleInfoValidate.value.coldAreaError = !isEmpty(infoData.value.coldArea) && !INT_REG.test(infoData.value.coldArea) ? labelTips.coldAreaTips : ''
    ruleInfoValidate.value.settledColdAreaError = !isEmpty(infoData.value.settledColdArea) && !INT_REG.test(infoData.value.settledColdArea) ? labelTips.settledColdAreaTips : ''
    ruleInfoValidate.value.warmAreaError = !isEmpty(infoData.value.warmArea) && !INT_REG.test(infoData.value.warmArea) ? labelTips.warmAreaTips : ''
    ruleInfoValidate.value.settledWarmAreaError = !isEmpty(infoData.value.settledWarmArea) && !INT_REG.test(infoData.value.settledWarmArea) ? labelTips.settledWarmAreaTips : ''
    ruleInfoValidate.value.residentsError = !isEmpty(infoData.value.residents) && !INT_REG.test(infoData.value.residents) ? labelTips.residentsTips : ''
    ruleInfoValidate.value.pictureUrlError = isEmpty(infoData.value.pictureUrl) ? labelTips.pictureUrlTips : ''
    ruleInfoValidate.value.descriptionError = !isEmpty(infoData.value.description) && infoData.value.description.length > 200 ? labelTips.descriptionTips : ''

    let key: keyof objInfoValidateT
    for (key in ruleInfoValidate.value) {
      if (ruleInfoValidate.value[key] !== '') return false
    }
    handleEditConfirm()
  }

  const handleEditConfirm = async () => {
    submitLoading.value = true
    let reqData: updateReqObject = {
      projectId: projectId,
      name: infoData.value.objectName,
      objectCode: infoData.value.objectCode,
      parentId: infoData.value.parentId,
      enable: infoData.value.enable,
      structureArea: !isEmpty(infoData.value.structureArea) ? infoData.value.structureArea : 0,
      settledStructureArea: !isEmpty(infoData.value.settledStructureArea) ? +infoData.value.settledStructureArea : 0,
      coldArea: !isEmpty(infoData.value.coldArea) ? +infoData.value.coldArea : 0,
      settledColdArea: !isEmpty(infoData.value.settledColdArea) ? +infoData.value.settledColdArea : 0,
      warmArea: !isEmpty(infoData.value.warmArea) ? +infoData.value.warmArea : 0,
      settledWarmArea: !isEmpty(infoData.value.settledWarmArea) ? +infoData.value.settledWarmArea : 0,
      residents: !isEmpty(infoData.value.residents) ? +infoData.value.residents : 0,
      pictureUrl: infoData.value.pictureUrl,
      description: infoData.value.description,
    }
    if (editStatus.value === 'edit') {
      reqData.id = infoData.value.id
    }
    const [error, data] = await addOrUpdateObject(reqData).run()
    if (!error) {
      DasMessage.success(`${editStatus.value === 'add' ? '添加' : '编辑'}能源对象成功`)
      if (emit) {
        emit('closeDialog', true, data.id)
      }
    }
    submitLoading.value = false
  }
  const handleCancel = () => {
    if (emit) {
      emit('closeDialog')
    }
  }
  const changeImage = () => {
    ruleInfoValidate.value.pictureUrlError = ''
  }
  return {
    editStatus,
    infoData,
    ruleInfoValidate,
    submitLoading,
    handleCancel,
    submitForm,
    changeImage,
  }
}
