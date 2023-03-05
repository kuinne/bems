import { Ref, ref, SetupContext, provide, watchEffect } from 'vue'
import { DasMessage } from '@/das-fe/ui'
import dayjs from 'dayjs'
import { getTypeList, delType } from '../apis'
import { isEmpty, emptyToBlank } from './common'

type TableRelatedObj = {
  currentPage: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  pageSizes: Ref<number[]>
  tableData: Ref<any>
  tableLoading: Ref<boolean>
  searchOptions: any
  multiSelection: Ref<any>
  editStatus: Ref<string>
  delContent: Ref<string>
  delVisible: Ref<boolean>
  editVisible: Ref<boolean>
  pageSizeChange: (n: any) => void
  currentPageChange: (n: any) => void
  getTableData: () => void
  searchData: () => void
  handleAdd: () => void
  handleDelBatch: () => void
  handleEdit: (n: any) => void
  handleView: (n: any) => void
  handleDel: (n: any) => void
  handleDelConfirm: (n: string) => void
  handleDelCancel: () => void
  handleCloseEdit: (n?: any) => void
  initData: () => void
}
export const basicEmits = ['update:visible', 'closeDialog']
export type BasicEmits = typeof basicEmits
export let editStatus = ref<string>('')
export let infoData = ref({
  id: '',
  typeCode: '',
  typeName: '',
  unit: '',
  tceValue: '',
  tValue: '',
  desc: '',
})

export const useTable = (): TableRelatedObj => {
  const initData = () => {
    getTableData()
  }
  // 过滤条件
  let searchOptions = ref([
    {
      type: 'searchInput',
      key: 'inputtKey',
      label: '',
      placeholder: '搜索分类名称',
      value: '',
      clearable: false,
      isIconLeft: true,
      layout: 'out',
      size: 'small',
    },
  ])
  // 表格
  const currentPage = ref(1)
  const pageSize = ref(20)
  const total = ref(0)
  const tableData = ref<any[]>([])
  let multiSelection = ref([])

  // 删除
  const delVisible = ref<boolean>(false)
  const delRecordId = ref<string>('')
  let delContent = ref('')
  // 批量删除
  const handleDelBatch = () => {
    if (!multiSelection.value.length) return
    delVisible.value = true
    const ids = multiSelection.value.map((e: any) => {
      return e.id
    })
    delRecordId.value = ids.join(',')
    delContent.value = `删除后将无法恢复<br>确定删除吗？`
  }
  // 单个删除
  const handleDel = (row: any): void => {
    console.log('handleDel')
    delVisible.value = true
    delContent.value = `删除后将无法恢复<br>确定删除吗？`
    delRecordId.value = row.id
  }
  // 确认删除
  const handleDelConfirm = async () => {
    const reqData = {
      ids: delRecordId.value.includes(',') ? delRecordId.value.split(',') : [delRecordId.value],
    }
    const [error, data] = await delType(reqData).run()
    if (!error) {
      DasMessage.success('删除能源分类成功')
      getTableData()
    }
    delVisible.value = false
    delRecordId.value = ''
  }
  // 取消删除
  const handleDelCancel = () => {
    delVisible.value = false
    delRecordId.value = ''
  }
  // 编辑
  let editVisible = ref(false)
  const handleEdit = (row: any): void => {
    resetInfo()
    console.log(row, 'handleEdit')
    editStatus.value = 'edit'
    setData(row, 'edit')
    editVisible.value = true
  }
  const handleView = (row: any): void => {
    editStatus.value = 'view'
    setData(row, 'view')
    editVisible.value = true
  }
  const resetInfo = () => {
    infoData.value = {
      id: '',
      typeCode: '',
      typeName: '',
      unit: '',
      tceValue: '',
      tValue: '',
      desc: '',
    }
  }
  // 新增
  const handleAdd = () => {
    resetInfo()
    editStatus.value = 'add'
    editVisible.value = true
  }
  // 详情赋值
  const setData = (n: any, m: any) => {
    infoData.value.id = n.id
    infoData.value.typeName = n.name
    infoData.value.typeCode = n.typeCode
    infoData.value.unit = n.calUnit
    infoData.value.tceValue = n.coalFactor
    infoData.value.tValue = n.ceFactor
    infoData.value.desc = n.description
  }
  // 列表分页
  const pageSizes = ref([20, 50, 100])
  const { loading: tableLoading, run, data, error } = getTypeList()
  // 查询表格
  const getTableData = () => {
    multiSelection.value = []
    const searchData = {
      pageSize: pageSize.value,
      pageIndex: currentPage.value,
      content: searchOptions.value[0].value,
    }
    run(searchData).then(() => {
      if (error.value) {
        return
      }
      const res = data.value
      const temptableData = res.records && res.records.length ? res.records : []
      tableData.value = temptableData.map((v: any) => {
        v.lastUpdateTime = !isEmpty(v.lastUpdateTime) ? dayjs(new Date(Number(v.lastUpdateTime))).format('YYYY-MM-DD HH:mm:ss') : ''
        v.lastUpdater = !isEmpty(v.lastUpdater) || !isEmpty(v.lastUpdaterId) ? `${emptyToBlank(v.lastUpdater)}(${emptyToBlank(v.lastUpdaterId)})` : ''
        return v
      })
      total.value = Number(res.total)
    })
  }
  // 切换每页条数
  const pageSizeChange = () => {
    currentPage.value = 1
    multiSelection.value = []
    getTableData()
  }
  // 翻页
  const currentPageChange = () => {
    getTableData()
  }

  // 筛选条件-搜索
  const searchData = () => {
    multiSelection.value = []
    currentPage.value = 1
    getTableData()
  }

  const handleCloseEdit = (isQuery: boolean) => {
    editVisible.value = false
    if (isQuery) {
      getTableData()
    }
  }
  return {
    initData,
    delContent,
    handleCloseEdit,
    editVisible,
    delVisible,
    currentPage,
    pageSize,
    total,
    pageSizes,
    tableData,
    tableLoading,
    searchOptions,
    multiSelection,
    editStatus,
    getTableData,
    pageSizeChange,
    currentPageChange,
    handleAdd,
    handleDel,
    handleView,
    handleDelBatch,
    handleDelConfirm,
    handleDelCancel,
    searchData,
    handleEdit,
  }
}
