<template>
  <div class="table-container" ref="containerRef">
    <div class="header-wrapper">
      <slot name="header"></slot>
    </div>
    <div class="table-wrapper">
      <das-spin full :spinning="loading">
        <das-table
          ref="tableRef"
          max-height="100%"
          selection
          hideSelectionText
          :data="data"
          v-model:current-page="page.curPage"
          v-model:page-size="page.pageSize"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-page-change="handleCurrentPageChange"
          v-model:selection-rows="selectionRows"
          v-bind="$attrs"
        >
          <Columns />
          <template #pagination-left>
            <slot name="pagination-left"></slot>
          </template>
        </das-table>
      </das-spin>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { computed, onMounted, ref, toRaw, useCssModule, watch } from 'vue'
import { DasTable, DasTableColumn, DasButton, DasSpin } from '@/das-fe/ui'
import type { Props, Emits } from './type'
import { isUndef } from '../../utils'

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const css = useCssModule()

const data = ref<any[]>(props.data)

const actions = ref(props.actions || ['view', 'edit', 'delete'])

const loading = ref(props.loading)
const total = ref<number>(props.total)
// 分页
const page = ref(props.page)

const tableRef = ref<InstanceType<typeof DasTable>>()

// 多选
const selectionRows = ref<any[]>(props.selectionRows)

const formatColumns = (columns: Props['columns']) => {
  return columns.map((column) => {
    if (!isUndef(column.enums) && isUndef(column.render)) {
      column.render = (scope: any) => <>{column.enums![scope.row[column.prop]]}</>
    }
    return column
  })
}

const Columns = () => {
  const dataColumns = formatColumns(props.columns).map((item) => (
    <DasTableColumn
      {...(item as any)}
      v-slots={{
        default: item.render,
      }}
    ></DasTableColumn>
  ))

  const actionColumn = (
    <DasTableColumn
      label="操作"
      v-slots={{
        default: (scope: any) => (
          <div class={css['action-wrapper']}>
            {actions.value.includes('view') && (
              <DasButton size="small" btnType="primary-text" block onClick={() => handleView(scope.$index, scope.row)}>
                查看
              </DasButton>
            )}
            {actions.value.includes('edit') && (
              <DasButton size="small" btnType="primary-text" block onClick={() => handleEdit(scope.$index, scope.row)}>
                编辑
              </DasButton>
            )}
            {actions.value.includes('delete') && (
              <DasButton size="small" btnType="primary-text" block onClick={() => handleDelete(scope.$index, scope.row)}>
                删除
              </DasButton>
            )}
          </div>
        ),
      }}
    />
  )
  if (actions.value.length === 0) {
    return dataColumns
  }

  return [...dataColumns, actionColumn]
}

const handlePageSizeChange = (pageSize: number) => {
  page.value.pageSize = pageSize
  emits('pageSizeChange', pageSize)
}

const handleCurrentPageChange = (curPage: number) => {
  page.value.curPage = curPage
  emits('currentPageChange', curPage)
}

const clearSelection = () => {
  tableRef.value?.$table?.clearSelection()
}

watch(
  () => page.value,
  () => {
    emits('update:page', page.value)
  },
  {
    deep: true,
  },
)

watch(
  () => data.value,
  () => {
    selectionRows.value = selectionRows.value.filter((row: any) => !!(data.value || []).find((item) => item.id === row.id))
  },
)

watch(
  () => selectionRows.value,
  () => {
    emits('update:selectionRows', selectionRows.value)
  },
)

watch(
  () => props.data,
  () => {
    data.value = props.data
  },
)

watch(
  () => props.total,
  () => {
    total.value = props.total
  },
)

watch(
  () => props.loading,
  () => {
    loading.value = props.loading
  },
)

watch(
  () => props.selectionRows,
  () => {
    selectionRows.value = props.selectionRows
  },
)
// 操作

const handleEdit = (index: number, row: any) => {
  emits('edit', toRaw(row))
}
const handleView = (index: number, row: any) => {
  emits('view', toRaw(row))
}
const handleDelete = (index: number, row: any) => {
  emits('delete', toRaw(row))
}

defineExpose({
  clearSelection,
})
</script>

<style lang="scss" scoped>
.table-container {
  background: #fff;
  height: 100%;
}

.table-wrapper {
  height: 100%;
  position: relative;
}
</style>
<style lang="scss" module>
.action-wrapper {
  display: flex;
  gap: 5px;
  :deep(.das-ui-button) {
    .ant-btn.ant-btn-sm {
      min-width: 30px !important;
    }
  }
}
</style>
