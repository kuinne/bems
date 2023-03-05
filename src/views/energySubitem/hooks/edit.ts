import { inject, Ref, ref, onMounted, SetupContext } from 'vue'
import { DasMessage } from '@/das-fe/ui'
import { addDimension, editGradeOrDimension, addGrade, projectId } from '../apis'
import { isEmpty, objAssign } from './common'
import { BasicEmits, editStatus, infoData, currentOrgId, currentOrgType } from './index'

type objInfoValidateT = {
  dimensionNameError: string
  dimensionCodeError: string
  gradeNameError: string
  gradeCodeError: string
  descriptionError: string
}

type editObjRelatedObj = {
  editStatus: Ref<string>
  ruleInfoValidate: Ref<objInfoValidateT>
  infoData: Ref<any>
  submitLoading: Ref<boolean>
  handleCancel: () => void
  submitForm: () => void
}

export const labelTips = {
  dimensionNameTips: '必填，最多20个汉字/字符。可为任意字符，不可重复',
  dimensionCodeTips: '必填，最多20个字符，只支持字母、数字、下划线，不可重复',
  gradeNameTips: '必填，最多20个汉字/字符。可为任意字符。同一层级下不可重复。',
  gradeCodeTips: '必填，最多20个字符，只支持字母、数字、下划线，同一维度下不可重复',
  descriptionTips: '非必填，默认为空。可为任意字符，最多200个汉字/字符',
}

export const useEditObject = (emit: SetupContext<BasicEmits>['emit']): editObjRelatedObj => {
  // 详情
  if (infoData.value && editStatus.value === 'edit') {
    infoData.value.id = infoData.value.id
  }
  let submitLoading = ref(false)
  let ruleInfoValidate = ref({
    dimensionNameError: '',
    dimensionCodeError: '',
    gradeNameError: '',
    gradeCodeError: '',
    descriptionError: '',
  })
  // 保存
  const submitForm = async () => {
    ruleInfoValidate.value = {
      dimensionNameError: '',
      dimensionCodeError: '',
      gradeNameError: '',
      gradeCodeError: '',
      descriptionError: '',
    }
    const CODE_REG = /^[0-9a-zA-Z_]{1,20}$/
    if (infoData.value.identifier) {
      ruleInfoValidate.value.dimensionNameError = isEmpty(infoData.value.dimensionName) || infoData.value.dimensionName.length > 20 ? labelTips.dimensionNameTips : ''
      if (editStatus.value === 'add') {
        ruleInfoValidate.value.dimensionCodeError = isEmpty(infoData.value.dimensionCode) || !CODE_REG.test(infoData.value.dimensionCode) ? labelTips.dimensionCodeTips : ''
      }
    } else {
      ruleInfoValidate.value.gradeNameError = isEmpty(infoData.value.gradeName) || infoData.value.gradeName.length > 20 ? labelTips.gradeNameTips : ''
      if (editStatus.value === 'add') {
        ruleInfoValidate.value.gradeCodeError = isEmpty(infoData.value.gradeCode) || !CODE_REG.test(infoData.value.gradeCode) ? labelTips.gradeCodeTips : ''
      }
    }
    ruleInfoValidate.value.descriptionError = !isEmpty(infoData.value.description) && infoData.value.description.length > 200 ? labelTips.descriptionTips : ''

    let key: keyof objInfoValidateT
    for (key in ruleInfoValidate.value) {
      if (ruleInfoValidate.value[key] !== '') return false
    }
    handleEditConfirm()
  }

  const handleEditConfirm = async () => {
    submitLoading.value = true
    if (editStatus.value === 'add') {
      if (infoData.value.identifier) {
        const reqData = {
          projectId: currentOrgType.value === 7 ? currentOrgId.value : '',
          orgId: currentOrgType.value !== 7 ? currentOrgId.value : '',
          name: infoData.value.dimensionName,
          dimensionCode: infoData.value.dimensionCode,
          description: infoData.value.description,
        }
        const [error, data] = await addDimension(reqData).run()
        if (!error) {
          DasMessage.success('添加能源维度成功')
          if (emit) {
            emit('closeDialog', true, data.id)
          }
        }
      } else {
        const reqData = {
          projectId: currentOrgType.value === 7 ? currentOrgId.value : '',
          orgId: currentOrgType.value !== 7 ? currentOrgId.value : '',
          name: infoData.value.gradeName,
          dimensionCode: infoData.value.gradeCode,
          description: infoData.value.description,
          rootId: infoData.value.belongDimensionId,
          parentId: infoData.value.parentGradeId
        }
        const [error, data] = await addGrade(reqData).run()
        if (!error) {
          DasMessage.success('添加能源层级成功')
          if (emit) {
            emit('closeDialog', true, data.id)
          }
        }
      }
    } else if (editStatus.value === 'edit') {
      const reqData = {
        id: infoData.value.id,
        name: infoData.value.identifier ? infoData.value.dimensionName : infoData.value.gradeName,
        description: infoData.value.description,
      }
      const [error, data] = await editGradeOrDimension(reqData).run()
      if (!error) {
        DasMessage.success(`编辑能源${infoData.value.identifier ? '维度' : '层级'}成功`)
        if (emit) {
          emit('closeDialog', true, data.id)
        }
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
