<template>
  <div>
    <das-dialog v-model="infoVisible" size="nomarl" class="edit-engobject-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <template #header
        >{{ editStatus === 'add' ? i18n('新增' as any).value : editStatus === 'edit' ? i18n('编辑' as any).value : i18n('查看' as any).value }}{{ i18n('能源对象' as any).value }}</template
      >
      <div ref="$myDialogBody" class="form-container">
        <das-form :cols="3" class="text-form" labelPosition="top" alignType="horizontal">
          <das-form-item
            :label="i18n('上级对象名称' as any).value"
            :col="1"
            type="input"
            v-model="infoData.parentName"
            :disabled="editStatus !== 'view'"
            :isView="editStatus === 'view'"
          ></das-form-item>
          <das-form-item
            :label="i18n('对象名称' as any).value"
            :col="1"
            type="input"
            maxlength="20"
            v-model="infoData.objectName"
            v-model:error="ruleInfoValidate.objectNameError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
            required
          ></das-form-item>
          <das-form-item
            :label="i18n('对象编码' as any).value"
            :col="1"
            type="input"
            class="factory-form-item"
            maxlength="20"
            v-model="infoData.objectCode"
            v-model:error="ruleInfoValidate.objectCodeError"
            :disabled="editStatus !== 'add'"
            :isView="editStatus === 'view'"
            required
          ></das-form-item>
          <das-form-item
            :label="i18n('是否启用' as any).value"
            class="switch-form-item"
            :col="1"
            type="switch"
            v-model="infoData.enable"
            v-model:error="ruleInfoValidate.enableError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
            required
          ></das-form-item>
          <das-form-item
            :label="i18n('建筑面积(㎡)' as any).value"
            :col="1"
            type="input"
            maxlength="10"
            v-model="infoData.structureArea"
            v-model:error="ruleInfoValidate.structureAreaError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
          ></das-form-item>
          <das-form-item
            :label="i18n('入驻建筑面积(㎡)' as any).value"
            class="factory-form-item"
            :col="1"
            type="input"
            maxlength="10"
            v-model="infoData.settledStructureArea"
            v-model:error="ruleInfoValidate.settledStructureAreaError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
          ></das-form-item>
          <das-form-item
            :label="i18n('空调面积(㎡)' as any).value"
            :col="1"
            type="input"
            maxlength="10"
            v-model="infoData.coldArea"
            v-model:error="ruleInfoValidate.coldAreaError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
          ></das-form-item>
          <das-form-item
            :label="i18n('入驻空调面积(㎡)' as any).value"
            :col="1"
            type="input"
            maxlength="10"
            v-model="infoData.settledColdArea"
            v-model:error="ruleInfoValidate.settledColdAreaError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
          ></das-form-item>
          <das-form-item
            :label="i18n('采暖面积(㎡)' as any).value"
            class="factory-form-item"
            :col="1"
            type="input"
            maxlength="10"
            v-model="infoData.warmArea"
            v-model:error="ruleInfoValidate.warmAreaError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
          ></das-form-item>
          <das-form-item
            :label="i18n('入驻采暖面积(㎡)' as any).value"
            :col="1"
            type="input"
            maxlength="10"
            v-model="infoData.settledWarmArea"
            v-model:error="ruleInfoValidate.settledWarmAreaError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
          ></das-form-item>
          <das-form-item
            :label="i18n('常驻人员' as any).value"
            class="factory-form-item"
            :col="1"
            type="input"
            maxlength="10"
            v-model="infoData.residents"
            v-model:error="ruleInfoValidate.residentsError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
          ></das-form-item>
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
          <das-form-item :label="i18n('图片' as any).value" type="custom" required v-model:error="ruleInfoValidate.pictureUrlError">
            <das-image-viewer
              show-image-name
              v-model="infoData.pictureUrl"
              @image-upload="changeImage"
              maxSize="5M"
              accept=".jpg,.png,.jpeg"
              service-name="enterprise-right"
              v-model:status="headPictureStatus"
            ></das-image-viewer>
          </das-form-item>
        </das-form>
      </div>
      <template #footer>
        <das-button btnType="default" @click="handleCancel">{{ i18n('取消' as any).value }}</das-button>
        <das-button btnType="primary" class="second-btn" :loading="submitLoading" @click="submitForm">{{ i18n('确定' as any).value }}</das-button>
      </template>
    </das-dialog>
  </div>
</template>
<script setup lang="ts">
import { i18n } from '@/utils/i18n'
import { ref, watchEffect } from 'vue'
import { DasButton, DasForm, DasFormItem, DasDialog, DasImageViewer } from '@/das-fe/ui'
import { basicEmits, infoData, editStatus } from '../hooks/index'
import { useEditObject } from '../hooks/edit'
interface dataProps {
  visible: boolean
}

let props = withDefaults(defineProps<dataProps>(), {
  visible: false,
})

const emit = defineEmits(basicEmits)
let infoVisible = ref<boolean>(props.visible)
watchEffect(() => {
  if (!infoVisible.value) {
    emit('update:visible', infoVisible.value)
  }
})
const { ruleInfoValidate, submitLoading, handleCancel, submitForm, changeImage } = useEditObject(emit)

const headPictureStatus = ref<'info' | 'normal' | 'error' | 'uploading'>('normal')

if (editStatus.value !== 'add') {
  // getInfo()
  if (editStatus.value === 'info') {
    headPictureStatus.value = 'info'
  }
}
</script>
<style lang="scss">
.edit-engobject-dialog {
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
    .das-ui-switch .switch-form-item {
      margin-top: 4px;
    }
  }
  .second-btn {
    margin-left: 12px;
  }
}
</style>
