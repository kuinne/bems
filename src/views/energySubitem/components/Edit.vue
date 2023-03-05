<template>
  <div>
    <das-dialog v-model="infoVisible" size="small" class="edit-productrule-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <template #header
        >{{ editStatus === 'add' ? i18n('新增' as any).value : editStatus === 'edit' ? i18n('编辑' as any).value : i18n('查看' as any).value }}{{ i18n(`${infoData.identifier?'维度':'层级'}` as any).value }}</template
      >
      <div ref="$myDialogBody" class="form-container">
        <das-form :cols="2" class="text-form" labelPosition="top" alignType="horizontal">
          <das-form-item :label="i18n('所属组织架构' as any).value" :col="1" type="input" v-model="currentOrgName" :disabled="editStatus !== 'view'" :isView="editStatus === 'view'" required></das-form-item>
          <template v-if="infoData.identifier">
            <!-- 维度 -->
            <das-form-item
              :label="i18n('维度名称' as any).value"
              class="factory-form-item"
              :col="1"
              type="input"
              maxlength="20"
              v-model="infoData.dimensionName"
              v-model:error="ruleInfoValidate.dimensionNameError"
              :disabled="editStatus === 'view'"
              :isView="editStatus === 'view'"
              required
            ></das-form-item>
            <das-form-item
              :label="i18n('维度编码' as any).value"
              :col="1"
              type="input"
              maxlength="20"
              v-model="infoData.dimensionCode"
              v-model:error="ruleInfoValidate.dimensionCodeError"
              :disabled="editStatus !== 'add'"
              :isView="editStatus === 'view'"
              required
            ></das-form-item>
          </template>
          <template v-else>
            <!-- 层级 -->
            <das-form-item
              :label="i18n('所属维度' as any).value"
              class="factory-form-item"
              :col="1"
              type="input"
              v-model="infoData.belongDimensionName"
              :disabled="editStatus !== 'view'"
              :isView="editStatus === 'view'"
              required
            ></das-form-item>
            <das-form-item
              :label="i18n('上级层级' as any).value"
              :col="1"
              type="input"
              v-model="infoData.parentGradeName"
              :disabled="editStatus !== 'view'"
              :isView="editStatus === 'view'"
              required
            ></das-form-item>
            <das-form-item
              :label="i18n('层级名称' as any).value"
              class="factory-form-item"
              :col="1"
              type="input"
              maxlength="20"
              v-model="infoData.gradeName"
              v-model:error="ruleInfoValidate.gradeNameError"
              :disabled="editStatus === 'view'"
              :isView="editStatus === 'view'"
              required
            ></das-form-item>
            <das-form-item
              :label="i18n('层级编码' as any).value"
              :col="1"
              type="input"
              maxlength="20"
              v-model="infoData.gradeCode"
              v-model:error="ruleInfoValidate.gradeCodeError"
              :disabled="editStatus !== 'add'"
              :isView="editStatus === 'view'"
              required
            ></das-form-item>
          </template>
          <das-form-item
            class="remark-form-item"
            :label="i18n('描述' as any).value"
            type="textarea"
            maxlength="200"
            show-word-limit
            v-model="infoData.description"
            v-model:error="ruleInfoValidate.descriptionError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
          ></das-form-item>
        </das-form>
      </div>
      <template #footer>
        <das-button btnType="default" @click="handleCancel">{{i18n('取消' as any).value}}</das-button>
        <das-button btnType="primary" class="second-btn" :loading="submitLoading" @click="submitForm">{{i18n('确定' as  any).value}}</das-button>
      </template>
    </das-dialog>
  </div>
</template>
<script setup lang="ts">
import { i18n } from '@/utils/i18n'
import { ref, watchEffect } from 'vue'
import { DasButton, DasForm, DasFormItem, DasDialog } from '@/das-fe/ui'
import { basicEmits, infoData, editStatus, currentOrgName } from '../hooks/index'
import { useEditObject } from '../hooks/edit'
interface dataProps {
  visible: boolean
}

let props = withDefaults(defineProps<dataProps>(), {
  visible: false
})

const emit = defineEmits(basicEmits)
let infoVisible = ref<boolean>(props.visible)
watchEffect(() => {
  if (!infoVisible.value) {
    emit('update:visible', infoVisible.value)
  }
})
const { ruleInfoValidate, submitLoading, handleCancel, submitForm } = useEditObject(emit)

const headPictureStatus = ref<'info' | 'normal' | 'error' | 'uploading'>('normal')

if (editStatus.value !== 'add') {
  // getInfo()
  if (editStatus.value === 'info') {
    headPictureStatus.value = 'info'
  }
}
</script>
<style lang="scss">
.edit-productrule-dialog {
  & > .el-dialog__body {
    & > .das-dialog__body {
      padding: 0 !important;
    }
  }
  .form-container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
  .text-form {
    width: 100%;
    height: 100%;
    padding-left: 55px;
    padding-right: 55px;
    padding-top: 30px;
    padding-bottom: 30px;
    box-sizing: border-box;
    .tips-line {
      margin-bottom: 30px;
      color: #999;
    }
    .factory-form-item {
      margin-right: 0 !important;
    }
    .remark-form-item {
      margin-right: 0 !important;
      width: 100%;
      flex: unset !important;
      .das-ui-form-container,
      .das-ui-input {
        width: 100%;
      }
    }
  }
  .second-btn {
    margin-left: 12px;
  }
}
</style>
