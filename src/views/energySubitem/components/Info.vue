<template>
  <das-form :cols="3" class="energysubitem-info-form" :marginRight="marginRight" labelPosition="top" alignType="horizontal">
    <das-form-item :label="i18n('所属组织架构' as any).value" :col="1" type="input" v-model="infoDataView.orgName" isView></das-form-item>
    <template v-if="infoDataView.identifier">
      <!-- 维度 -->
      <das-form-item :label="i18n('维度名称' as any).value" :col="1" type="input" v-model="infoDataView.dimensionName" isView required></das-form-item>
      <das-form-item :label="i18n('维度编码' as any).value" class="factory-form-item" :col="1" type="input" v-model="infoDataView.dimensionCode" isView required></das-form-item>
    </template>
    <template v-else>
      <!-- 层级 -->
      <das-form-item :label="i18n('所属维度' as any).value" :col="1" type="input" v-model="infoDataView.belongDimensionName" isView required></das-form-item>
      <das-form-item :label="i18n('上级层级' as any).value" class="factory-form-item" :col="1" type="input" v-model="infoDataView.parentGradeName" isView required></das-form-item>
      <das-form-item :label="i18n('层级名称' as any).value" :col="1" type="input" v-model="infoDataView.gradeName" isView required></das-form-item>
      <das-form-item :label="i18n('层级编码' as any).value" :col="1" type="input" v-model="infoDataView.gradeCode" isView required></das-form-item>
    </template>

    <das-form-item class="remark-form-item" :label="i18n('描述' as any).value" type="textarea" maxlength="200" show-word-limit v-model="infoDataView.description" isView></das-form-item>
  </das-form>
</template>
<script setup lang="ts">
import { i18n } from '@/utils/i18n'
import { DasForm, DasFormItem } from '@/das-fe/ui'
import { infoDataView } from '../hooks/index'
interface proinfoProps {
  marginRight: string
  /** 1 维度  2层级 */
  type: number
}
const props = withDefaults(defineProps<proinfoProps>(), {
  marginRight: '30px',
  type: 1,
})
</script>
<style scoped lang="scss">
.energysubitem-info-form {
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
}
</style>
