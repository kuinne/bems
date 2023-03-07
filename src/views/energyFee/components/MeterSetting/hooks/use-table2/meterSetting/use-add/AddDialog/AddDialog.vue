<template>
  <das-dialog :title="title" v-model="visible" @close="handleClose" width="960px" height="580px">
    <div ref="$myDialogBody" class="layout-container">
      <div class="left">
        <div class="energy-type">
          <div class="label">能源类型</div>
          <div class="box">电</div>
        </div>
        <div class="energy-dimension">
          <div class="label">能源维度</div>
          <Tab :options="tabOptions" v-model="tabActiveKey" />
        </div>
        <Tree />
      </div>
      <div class="main">
        <Table v-model:selection-rows="selectionRows" />
      </div>
      <div class="right">
        <SelectList v-model:selection-rows="selectionRows" />
      </div>
    </div>
    <template #footer>
      <das-button class="submit-btn" btnType="primary" @click="handleSubmit" v-if="['edit', 'add'].includes(props.type)">{{ i18n('提交' as any).value }}</das-button>
      <das-button @click="handleCancel">{{ i18n('取消' as any).value }}</das-button>
    </template>
  </das-dialog>
</template>

<script setup lang="ts">
import { DasDialog, DasForm, DasFormItem, DasButton, DasMessage, DasIcon, DasTooltip } from '@/das-fe/ui'
import Tab from './Tab.vue'
import Tree from './Tree.vue'
import Table from './Table.vue'
import SelectList from './SelectList.vue'
import type { Props, Emits } from './type'
import { ref, toRaw, unref, watchEffect, computed } from 'vue'
import { i18n } from '@/utils/i18n'

const $myDialogBody = ref()
const popupCont = (triggerNode: any) => {
  return $myDialogBody.value?.parentNode.parentNode
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const visible = ref(false)

const formData = ref<any>({})

const title = computed(() => {
  const map = {
    edit: '编辑',
    add: '新增',
    view: '查看',
  }
  return map[props.type] + props.title
})

const tabOptions = ref([
  {
    label: '我是内容',
    key: '1',
    showTooltip: false,
  },
  {
    label: '我是内容我是内容我是内容',
    key: '2',
    showTooltip: true,
  },
  {
    label: '我是内容我是内容我是内容',
    key: '3',
    showTooltip: false,
  },
  {
    label: '我是内容',
    key: '4',
    showTooltip: false,
  },
  {
    label: '我是内容',
    key: '5',
    showTooltip: false,
  },
])
const tabActiveKey = ref(tabOptions.value[0].key)

const selectionRows = ref<any[]>([])
const handleClose = () => {
  emits('close')
}

const handleCancel = () => {
  emits('close')
}

const resetForm = () => {
  formData.value = {}
}

const handleSubmit = () => {
  emits('submit', formData.value)
}

watchEffect(() => {
  visible.value = props.visible
  if (!props.visible) {
    resetForm()
  }
})
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
