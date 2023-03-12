import { ref, watch, Ref, toRaw, watchEffect, computed, onMounted, onActivated } from 'vue'

import { Table } from '@/views/energyFee/common/components/Table'
import type { TableProps } from '@/views/energyFee/common/components/Table'
import { i18n } from '@/utils/i18n'
import { getSetting } from '@/views/energyFee/apis'
import { optionsToEnums } from '@/views/energyFee/common/utils'
import { charingTypeOptions } from '@/views/energyFee/modules/charingSetting/constants'
import { vAuth } from '@/utils/directive'
import type { Fn } from '../../../common/type'
import { DasSpin } from '@/das-fe/ui'
export function useTable(options: { filterObj: Ref<any>; onEdit: Fn<any>; onView: Fn<any>; onDelete: Fn<any> }) {
  const tableRef = ref<InstanceType<typeof Table>>()
  const columns = ref<TableProps['columns']>([
    {
      label: i18n('计费标准' as any).value,
      prop: 'name',
      contentType: 'link',
      onClickLink: (row: any) => {
        handleView(row)
      },
    },
    {
      label: i18n('能源分类' as any).value,
      prop: 'energyTypeName',
    },
    {
      label: i18n('计费方式' as any).value,
      prop: 'billingMethod',
      enums: optionsToEnums(charingTypeOptions),
    },
    {
      label: i18n('备注' as any).value,
      prop: 'remark',
    },
  ])
  const data = ref<TableProps['data']>([])
  const loading = ref<TableProps['loading']>(false)
  const total = ref<TableProps['total']>(0)
  const selectionRows = ref<TableProps['columns']>([])
  const page = ref<TableProps['page']>({
    pageSize: 20,
    curPage: 1,
  })

  const filterObj = ref({
    energyTypeId: '-1',
    ...options.filterObj.value,
  })

  const actions = computed<TableProps['actions']>(() => {
    const res: any[] = ['view']
    if (vAuth(null, { code: 'charingSetting-edit' })) {
      res.push('edit')
    }

    if (vAuth(null, { code: 'charingSetting-delete' })) {
      res.push('delete')
    }

    return res
  })

  const fetchData = async () => {
    console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡 charingSetting/use-table/fetchData')
    clearSelection()
    loading.value = true
    data.value = []

    const params = {
      pageIndex: page.value.curPage,
      pageSize: page.value.pageSize,
      ...filterObj.value,
    }
    const [error, res] = await getSetting(params)

    loading.value = false
    if (!error) {
      data.value = res.records
      total.value = parseFloat(res.total || 0)
    }
  }

  const handleView = (row: any) => {
    options.onView(row)
  }

  const handleEdit = (row: any) => {
    options.onEdit(row)
  }

  const handleDelete = (row: any) => {
    options.onDelete([row.id])
  }

  const clearSelection = () => {
    selectionRows.value = []
    tableRef.value?.clearSelection()
  }

  const handleCurrentPageChange = () => {
    fetchData()
  }

  const handlePageSizeChange = () => {
    page.value.curPage = 1
    fetchData()
  }

  watch(
    () => options.filterObj.value,
    () => {
      filterObj.value = {
        ...filterObj.value,
        ...options.filterObj.value,
      }
    },
    {
      deep: true,
    },
  )

  watch(
    () => filterObj.value,
    (val, oldVal) => {
      if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
        page.value.curPage = 1
        fetchData()
      }
    },
  )

  const render = () => {
    return (
      <DasSpin full spinning={loading.value}>
        <Table
          ref={tableRef}
          columns={columns.value}
          data={data.value}
          total={total.value}
          actions={actions.value}
          v-model:selectionRows={selectionRows.value}
          v-model:page={page.value}
          emptyText={loading.value ? '' : i18n('暂无数据' as any).value}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCurrentPageChange={handleCurrentPageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </DasSpin>
    )
  }

  return {
    Table: render,
    selectionRows,
    update: fetchData,
    clearSelection,
  }
}
