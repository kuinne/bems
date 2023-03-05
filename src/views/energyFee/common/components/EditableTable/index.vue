<template>
  <div class="editable-table-container" ref="containerRef">
    <div :class="['table-container', { 'is-view': props.isView }]">
      <div class="action-wrapper" v-if="!props.isView">
        <das-button btn-type="primary-text" size="large" @click="handleAdd">{{i18n('添加' as any).value}}</das-button>
        <das-button btn-type="primary-text" size="large" @click="handleBatchDelete" :disabled="selectionRows.length === 0">{{i18n('删除' as any).value}}</das-button>
      </div>
      <das-table
        ref="tableRef"
        :selection="!props.isView"
        outer-border
        :data="tableData"
        v-model:selection-rows="selectionRows"
        @cell-mouse-enter="handleMouseEnter"
        @cell-mouse-leave="handleMouseLeave"
      >
        <das-table-column v-for="col in tableColumns" :key="col.prop" :label="col.label" :prop="col.prop" :show-overflow-tooltip="false">
          <template #header="{ column }">
            <span :class="['column-label', { 'is-required': col.required }]">{{ column.label }} </span>
          </template>
          <template #default="{ row }">
            <div v-if="isEditingRow(row)">
              <das-select
                v-if="col.type === 'select'"
                width="100%"
                border-type="bordered"
                :options="typeof col.options === 'function' ? col.options(row) : col.options"
                v-model="row[col.prop]"
                :error="getError(row, col.prop)"
                :error-label="getErrorLabel(row, col.prop)"
                :getPopupContainer="() => containerRef.parentNode.parentNode"
                :onDropdownVisibleChange="onDropdownVisibleChange"
                @select="clearError(row, col.prop)"
                @change="handleChange"
              ></das-select>
              <das-input
                v-else
                width="100%"
                size="table"
                border-type="bordered"
                v-model="row[col.prop]"
                :error="getError(row, col.prop)"
                :error-label="getErrorLabel(row, col.prop)"
                @input="clearError(row, col.prop)"
                @change="handleChange"
              ></das-input>
            </div>
            <div v-else>{{ row[col.prop] || '-' }}</div>
          </template>
        </das-table-column>
      </das-table>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, defineProps, defineEmits, watchEffect } from 'vue'
import { DasTable, DasTableColumn, DasInput, DasSelect, DasButton } from '@/das-fe/ui'
import { useValidate } from './use-validate'
import { nanoid } from 'nanoid'
import { useRowEdit } from './use-row-edit'
import type { Props, Emits } from './type'
import { i18n } from '@/utils/i18n'

const props = withDefaults(defineProps<Props>(), {
  modelValue: [],
  isView: false,
})

const emits = defineEmits<Emits>()

const containerRef = ref()

const tableRef = ref()

const tableData = ref<any>([])
const tableColumns = ref<Props['columns']>(props.columns || [])

watchEffect(() => {
  tableData.value = props.modelValue
})

const selectionRows = ref<any>([])

const dropdownVisible = ref(false)

const { isEditingRow, clearEditingRows, setEditingRow } = useRowEdit()
const { getError, getErrorLabel, clearError, clearErrors, validate } = useValidate({
  tableData,
  tableColumns: tableColumns.value,
  setEditingRow,
})

const onDropdownVisibleChange = (val: boolean) => {
  dropdownVisible.value = val
}

const handleMouseEnter = (row: any) => {
  if (props.isView) return
  setEditingRow(row, true)
}

const handleMouseLeave = (row: any) => {
  if (dropdownVisible.value) {
    return
  }
  setEditingRow(row, false)
}

const handleAdd = () => {
  tableData.value.push({
    id: nanoid(),
    ...props.defaultData,
  })
}

const handleBatchDelete = () => {
  tableData.value = tableData.value.filter((item: any) => !selectionRows.value.find((row: any) => row === item))
  tableRef.value.$table.clearSelection()
  clearErrors(selectionRows.value)
  clearEditingRows(selectionRows.value)
}

const handleChange = () => {
  emits('update:modelValue', tableData.value)
}

defineExpose({
  validate,
})
</script>
<style scoped lang="scss">
.editable-table-container {
  width: 100%;

  :deep(.das-ui-form-item) {
    margin-right: 0 !important;
  }

  .table-container {
    width: 100%;
    margin-top: -20px;
    &.is-view {
      margin-top: 0;
    }
    .column-label {
      position: relative;
      &.is-required {
        &::after {
          content: '*';
          position: absolute;
          top: 0;
          right: -8px;
          width: 6px;
          height: 18px;
          line-height: 18px;
          text-align: left;
          color: var(--das-ui-form-error-label-color);
        }
      }
    }
  }

  .action-wrapper {
    display: flex;
    margin-bottom: 10px;

    :deep(.das-ui-button) {
      &:first-child {
        margin-left: auto;
      }
      &:not(:last-child) {
        margin-right: 30px;
      }
      .ant-btn.ant-btn-lg {
        min-width: 0px;
      }
    }
  }
}
</style>
