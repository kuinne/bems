<template>
  <das-form :cols="3" class="energyobject-info-form" :marginRight="marginRight" labelPosition="top" alignType="horizontal">
    <das-form-item :label="i18n('上级对象名称' as any).value" :col="1" type="input" v-model="infoDataView.parentName" isView></das-form-item>
    <das-form-item :label="i18n('对象名称' as any).value" :col="1" type="input" maxlength="20" v-model="infoDataView.objectName" isView required></das-form-item>
    <das-form-item :label="i18n('对象编码' as any).value" :col="1" type="input" class="factory-form-item" maxlength="20" v-model="infoDataView.objectCode" isView required></das-form-item>
    <das-form-item class="switch-form-item" :label="i18n('是否启用' as any).value" :col="1" type="switch" v-model="infoDataView.enable" isView disabled required></das-form-item>
    <das-form-item :label="i18n('建筑面积(㎡)' as any).value" :col="1" type="input" maxlength="10" v-model="infoDataView.structureArea" isView></das-form-item>
    <das-form-item :label="i18n('入驻建筑面积(㎡)' as any).value" class="factory-form-item" :col="1" type="input" maxlength="10" v-model="infoDataView.settledStructureArea" isView></das-form-item>
    <das-form-item :label="i18n('空调面积(㎡)' as any).value" :col="1" type="input" maxlength="10" v-model="infoDataView.coldArea" isView></das-form-item>
    <das-form-item :label="i18n('入驻空调面积(㎡)' as any).value" :col="1" type="input" maxlength="10" v-model="infoDataView.settledColdArea" isView></das-form-item>
    <das-form-item :label="i18n('采暖面积(㎡)' as any).value" class="factory-form-item" :col="1" type="input" maxlength="10" v-model="infoDataView.warmArea" isView></das-form-item>
    <das-form-item :label="i18n('入驻采暖面积(㎡)' as any).value" :col="1" type="input" maxlength="10" v-model="infoDataView.settledWarmArea" isView></das-form-item>
    <das-form-item :label="i18n('常驻人员' as any).value" class="factory-form-item" :col="1" type="input" maxlength="10" v-model="infoDataView.residents" isView></das-form-item>
    <das-form-item class="remark-form-item" :label="i18n('描述' as any).value" type="textarea" maxlength="200" show-word-limit v-model="infoDataView.description" isView></das-form-item>
    <das-form-item :label="i18n('图片' as any).value" type="custom" required>
      <das-image-viewer show-image-name v-model="infoDataView.pictureUrl" maxSize="5M" accept=".jpg,.png,.jpeg" service-name="enterprise-right" v-model:status="headPictureStatus"></das-image-viewer>
    </das-form-item>
  </das-form>
</template>
<script setup lang="ts">
import { i18n } from '@/utils/i18n'
import { ref } from 'vue'
import { DasForm, DasFormItem, DasImageViewer } from '@/das-fe/ui'
import { infoDataView } from '../hooks/index'
interface proinfoProps {
  marginRight: string
}
const props = withDefaults(defineProps<proinfoProps>(), {
  marginRight: '30px',
})

const headPictureStatus = ref<'info' | 'normal' | 'error' | 'uploading'>('info')
</script>
<style scoped lang="scss">
.energyobject-info-form {
  width: 100%;
  height: 100%;
  padding: 8px 20px 10px 20px;
  box-sizing: border-box;
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
  :deep(.das-ui-switch) .switch-form-item {
    margin-top: 4px;
  }
}
</style>
