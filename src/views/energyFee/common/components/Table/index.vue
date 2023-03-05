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
          :data="tableData"
          v-model:current-page="tablePage.curPage"
          v-model:page-size="tablePage.pageSize"
          :total="tablePage.total"
          @size-change="handlePageSizeChange"
          @current-page-change="handleCurrentPageChange"
          v-model:selection-rows="multipleSection"
        >
          <Columns />
        </das-table>
      </das-spin>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { computed, onMounted, ref, toRaw, useCssModule, watchEffect } from 'vue'
import { DasTable, DasTableColumn, DasButton, DasSpin } from '@/das-fe/ui'
import type { Props, Emits } from './type'
import type { TablePageType, InitDataParamsType } from './type'
import { isUndef, removeEmptyKey } from '../../utils'
import deepmerge from 'deepmerge'

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const css = useCssModule()

const tableData = ref<any[]>()

const loading = ref(false)

const filterObj = ref<NonNullable<InitDataParamsType['filterObj']>>({})

const tableRef = ref<InstanceType<typeof DasTable>>()

// 多选
const multipleSection = ref<any[]>([])

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
            <DasButton size="small" btnType="primary-text" block onClick={() => handleView(scope.$index, scope.row)}>
              查看
            </DasButton>
            <DasButton size="small" btnType="primary-text" block onClick={() => handleEdit(scope.$index, scope.row)}>
              编辑
            </DasButton>
            <DasButton size="small" btnType="primary-text" block onClick={() => handleDelete(scope.$index, scope.row)}>
              删除
            </DasButton>
          </div>
        ),
      }}
    />
  )

  return [...dataColumns, actionColumn]
}

const mergeParams = (params?: InitDataParamsType) => {
  const innerParams = removeEmptyKey({
    tablePage: tablePage.value,
    filterObj: filterObj.value,
  })
  const outerParams = removeEmptyKey({
    tablePage: params?.tablePage,
    filterObj: params?.filterObj,
  })
  const mergedParams = deepmerge.all<InitDataParamsType>([innerParams, outerParams])

  if (mergedParams.tablePage?.curPage) {
    tablePage.value.curPage = mergedParams.tablePage?.curPage
  }

  if (mergedParams.tablePage?.pageSize) {
    tablePage.value.pageSize = mergedParams.tablePage?.pageSize
  }
  return mergedParams
}

const loadData = async (params?: InitDataParamsType) => {
  const mergedParams = mergeParams(params)

  loading.value = true
  try {
    const { total, data } = await props.loadData(mergedParams)
    tableData.value = data
    tablePage.value.total = total
    mergedParams.filterObj && (filterObj.value = mergedParams.filterObj)
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// 分页
const tablePage = ref<TablePageType>({
  curPage: 1,
  total: 0,
  pageSize: 10,
})

const handlePageSizeChange = (pageSize: number) => {
  loadData({
    tablePage: {
      ...tablePage.value,
      pageSize,
    },
  })
}

const handleCurrentPageChange = (curPage: number) => {
  loadData({
    tablePage: {
      ...tablePage.value,
      curPage,
    },
  })
}

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

onMounted(() => {
  loadData()
})

defineExpose({
  reload: (params?: InitDataParamsType) => loadData(params),
  multipleSection,
  tablePage,
  tableData,
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
