<template>
  <div>
    <das-dialog v-model="infoVisible" size="nomarl" class="edit-productrule-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <template #header
        >{{ editStatus === 'add' ? i18n('新增' as any).value : editStatus === 'edit' ? i18n('编辑' as any).value : i18n('查看' as any).value }}{{ i18n('能源分类' as any).value }}</template
      >
      <div ref="$myDialogBody" class="form-container">
        <das-form :cols="3" class="text-form" labelPosition="top" alignType="horizontal">
          <das-form-item
            :label="i18n('分类名称' as any).value"
            :col="1"
            type="input"
            maxlength="20"
            v-model="infoData.typeName"
            v-model:error="ruleInfoValidate.typeNameError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
            required
          ></das-form-item>
          <das-form-item
            :label="i18n('分类编码' as any).value"
            :col="1"
            type="input"
            maxlength="20"
            v-model="infoData.typeCode"
            v-model:error="ruleInfoValidate.typeCodeError"
            :disabled="editStatus !== 'add'"
            :isView="editStatus === 'view'"
            required
          ></das-form-item>
          <das-form-item
            :label="i18n('能源单位' as any).value"
            :col="1"
            type="input"
            class="factory-form-item"
            maxlength="10"
            v-model="infoData.unit"
            v-model:error="ruleInfoValidate.unitError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
            required
          ></das-form-item>
          <das-form-item
            :label="i18n('折标煤系数（tce）' as any).value"
            :col="1"
            type="input"
            maxlength="21"
            v-model="infoData.tceValue"
            v-model:error="ruleInfoValidate.tceValueError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
            required
          ></das-form-item>
          <das-form-item
            :label="i18n('折碳排放系数（t）' as any).value"
            :col="1"
            type="input"
            maxlength="21"
            v-model="infoData.tValue"
            v-model:error="ruleInfoValidate.tValueError"
            :disabled="editStatus === 'view'"
            :isView="editStatus === 'view'"
            required
          ></das-form-item>
          <das-form-item
            class="remark-form-item"
            :label="i18n('描述' as any).value"
            type="textarea"
            maxlength="200"
            show-word-limit
            :isView="editStatus === 'view'"
            v-model="infoData.desc"
            v-model:error="ruleInfoValidate.descError"
          ></das-form-item>
        </das-form>
      </div>
      <template #footer>
        <das-button btnType="default" @click="handleCancel">{{ editStatus === 'view' ? i18n('关闭' as any).value : i18n('取消' as any).value }}</das-button>
        <das-button btnType="primary" class="second-btn" :loading="submitLoading" @click="submitForm" v-if="editStatus !== 'view'">{{i18n('确定' as any).value}}</das-button>
      </template>
    </das-dialog>
  </div>
</template>
<script setup lang="ts">
import { i18n } from '@/utils/i18n'
import { ref, watchEffect } from 'vue'
import { DasButton, DasForm, DasFormItem, DasDialog } from '@/das-fe/ui'
import { basicEmits, editStatus } from '../hooks/index'
import { useEdit } from '../hooks/edit'
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

const { infoData, ruleInfoValidate, submitLoading, handleCancel, submitForm } = useEdit(emit)
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
