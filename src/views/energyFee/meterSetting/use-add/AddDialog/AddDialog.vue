<template>
  <das-dialog :title="title" v-model="visible" @close="handleClose" width="960px" height="580px">
    <div ref="$myDialogBody" class="layout-container" v-if="visible">
      <div class="left">
        <div class="energy-type">
          <div class="label">能源类型</div>
          <div class="box">{{ props.energyType.name }}</div>
        </div>
        <div class="energy-dimension" v-if="dimensionData.length > 0">
          <div class="label">能源维度</div>
          <Tab :options="dimensionData" v-model="currentDimensionId" key-name="id" label-name="name" />
        </div>
        <Tree :energy-type-id="energyType.id" :dimension-id="currentDimensionId" @search="handleTreeSearch" />
      </div>
      <div class="main">
        <Table v-model:selection-rows="selectionRows" :dimension-id="currentDimensionId" :checked-nodes="tableCheckedNodes" />
      </div>
      <div class="right">
        <SelectList v-model:selection-rows="selectionRows" />
      </div>
    </div>
    <template #footer>
      <das-button class="submit-btn" btnType="primary" @click="handleSubmit">{{ i18n('提交' as any).value }}</das-button>
      <das-button @click="handleClose">{{ i18n('取消' as any).value }}</das-button>
    </template>
  </das-dialog>
</template>

<script setup lang="ts">
import { DasDialog, DasButton, DasMessage } from '@/das-fe/ui'
import Tab from './Tab.vue'
import Tree from './Tree.vue'
import Table from './Table.vue'
import SelectList from './SelectList.vue'
import type { Props, Emits } from './type'
import { ref, toRaw, unref, watchEffect, watch } from 'vue'
import { i18n } from '@/utils/i18n'
import { getDimension } from '@/views/energyFee/apis'

const $myDialogBody = ref()
const popupCont = (triggerNode: any) => {
  return $myDialogBody.value?.parentNode.parentNode
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const visible = ref(false)

const title = '添加表计'

const dimensionData = ref<any[]>([])
const currentDimensionId = ref<string>('')

const selectionRows = ref<any[]>([])

const tableCheckedNodes = ref<any[]>([])
const handleClose = () => {
  emits('close')
}

const handleSubmit = () => {
  if (selectionRows.value.length === 0) {
    DasMessage.warning({
      message: '请选择表计',
    })
    return
  }
  emits(
    'submit',
    selectionRows.value.map((item) => item.id),
  )
}

const fetchDimensionData = async () => {
  dimensionData.value = []
  const params = {
    energyTypeId: props.energyType.id,
  }
  const [error, data] = await getDimension(params)
  if (!error) {
    dimensionData.value = data
    if (data.length > 0) {
      currentDimensionId.value = data[0].id
    }
  }
}

const handleTreeSearch = (_checkedNodes: any[]) => {
  tableCheckedNodes.value = _checkedNodes.map((item) => ({
    typeCode: props.energyType.code,
    dimensionId: currentDimensionId.value,
    ObjId: item.isObj ? item.id : null,
    gradationId: !item.isObj ? item.orgId : null,
    objectName: item.name,
  }))
}

watch(
  () => props.visible,
  () => {
    if (!props.visible) {
      selectionRows.value = []
      tableCheckedNodes.value = []
    } else {
      fetchDimensionData()
    }
    visible.value = props.visible
  },
)
</script>

<style scoped lang="scss">
:deep(.submit-btn) {
  margin-right: 10px;
}
.form-item-right {
  margin-right: 0px !important;
}
.layout-container {
  display: flex;
  height: 480px;
  color: #666666;
  .left {
    width: 225px;
    border-right: 1px solid #d9d9d9;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .label {
      font-size: 12px;
      color: #666666;
      letter-spacing: 0;
      line-height: 18px;
      font-weight: 400;
    }

    .energy-type {
      margin: 10px 16px;

      .box {
        width: 100%;
        height: 24px;
        background: #5582f3;
        color: #ffffff;
        text-align: center;
        line-height: 24px;
        margin-top: 8px;
      }
    }
    .energy-dimension {
      .label {
        margin-left: 16px;
      }
    }
  }
  .main {
    flex: 0 0 533px;
    box-sizing: border-box;
  }

  .right {
    flex: 0 0 200px;
    border-left: 1px solid #d9d9d9;
    box-sizing: border-box;
  }
}
:deep(.das-dialog__body) {
  padding: 0px !important;
}
</style>
