import { Ref, ref, watch, SetupContext, provide, onMounted, toRaw, nextTick } from 'vue'
import { DasMessage } from '@/das-fe/ui'
import dayjs from 'dayjs'
import { getAuthTree, getOrgInfo, delSubitem, getSubitemTree, sortSubitem, getSubitemInfo, getSubitemTreeById, getGradeByFilter, projectId } from '../apis'
import type { TreeProps } from '../components/tree'
import { isEmpty, objAssign, anyObjectT, swapArray } from './common'
import type Node from 'element-plus/es/components/tree/src/model/node'

export const basicEmits = ['update:visible', 'closeDialog']
export type BasicEmits = typeof basicEmits
export type ruleInfoT = {
  id: any
  identifier: boolean
  orgId: any
  orgName: any
  dimensionName: any
  dimensionCode: any
  gradeName: any
  gradeCode: any
  belongDimensionId: any
  belongDimensionName: any
  parentGradeId: any
  parentGradeName: any
  description: any
}
type SubitemRelatedObj = {
  editStatus: Ref<string>
  delContent: Ref<string>
  delVisible: Ref<boolean>
  editVisible: Ref<boolean>
  handleDelConfirm: (n: string) => void
  handleDelCancel: () => void
  handleAdd: () => void
  handleClickOrg: (n: any) => void
  handleCloseEdit: (n: any, m?: any) => void
  treeData: Ref<any>
  keyword: Ref<string>
  currentItem: Ref<string>
  currentPath: Ref<string>
  load: (n: any) => Promise<any>
  requestfilterTree: (n: any) => Promise<any>
  handleClickTreeNode: (n: any) => void
  dragStart: (n: any, m: any) => void
  dragFinish: (n: any, m: any, h: any) => void
  dragBrotherNode: (n: any, m: any, h: string) => void
  orgTreeData: Ref<any>
  orgKeyword: Ref<string>
  OrgPathValue: Ref<string>
  currentOrgId: Ref<string>
  getOperationsLayout: (m: any, n: any) => any
  handleOperation: (m: any, n: any, h: any) => void
}
export let editStatus = ref<string>('')
export let editVisible = ref(false)
export let infoData = ref({
  id: '',
  identifier: true,
  orgId: '',
  orgName: '',
  dimensionName: '',
  dimensionCode: '',
  gradeName: '',
  gradeCode: '',
  belongOrgName: '',
  belongDimensionId: '',
  belongDimensionName: '',
  parentGradeId: '',
  parentGradeName: '',
  description: '',
})
export let infoDataView = ref({
  id: '',
  identifier: true,
  orgId: '',
  orgName: '',
  dimensionName: '',
  dimensionCode: '',
  gradeName: '',
  gradeCode: '',
  belongOrgName: '',
  belongDimensionId: '',
  belongDimensionName: '',
  parentGradeId: '',
  parentGradeName: '',
  description: '',
})
// ??????
export let currentOrgId = ref<string>('')
export let currentOrgName = ref<string>('')
// ????????????  1??????  7??????
export let currentOrgType = ref<any>(1)
export const useEnergySubitem = ($subitemTree: any): SubitemRelatedObj => {
  onMounted(() => {
    getOrgTreeData()
  })
  // ??????
  const delVisible = ref<boolean>(false)
  const delRecordId = ref<string>('')
  let delContent = ref('')

  // ??????????????????
  watch(currentOrgId, async (val) => {
    if (!isEmpty(val)) {
      currentItem.value = ''
      const [error, data] = await getOrgInfo().run({ id: val })
      if (error) return {}
      currentOrgType.value = data.type
      currentOrgName.value = data.name
      resetLoadTree()
    }
  })
  // ?????????
  const orgKeyword = ref<string>('')
  const OrgPathValue = ref<string>('')
  let orgTreeData = ref<any>([])

  const { loading: treeLoading, run, data, error } = getAuthTree()
  const getOrgTreeData = async (id?: string) => {
    await run()
    if (error.value) return
    if (data.value.length) {
      currentOrgId.value = data.value[0].id
      currentOrgName.value = data.value[0].name
      currentOrgType.value = data.value[0].type
      orgTreeData.value = data.value
    }
  }
  // ????????????
  const handleClickOrg = async (val: any) => {
  }

  // ?????????
  const keyword = ref<string>('')
  const currentPath = ref<string>('')
  let treeData = ref<any>([])
  let currentItem = ref<string>('')
  const treeNode = ref<TreeProps>()
  const isTreeChild = ref(false)
  let updateNodeType = ref('self')
  const handleClickTreeNode = (val: any) => {
    onView(val)
  }
  // ???????????????
  const resetLoadTree = async () => {
    let params: anyObjectT = {}
    if (currentOrgType.value === 7) {
      params.projectId = currentOrgId.value
    } else {
      params.orgId = currentOrgId.value
    }

    $subitemTree.value?.resetLazyLoad()
    setTimeout(async () => {
      const [err, da] = await getSubitemTree(params).run()
      if (err) return {}
      currentItem.value = da && da.length > 0 ? da[0].id : ''
      getNodeInfo({ id: currentItem.value })
    }, 300)
  }

  // ??????????????????
  let tempTree = ref([])
  const load = async (node?: any) => {
    let params: anyObjectT = {}
    if (node?.id) {
      console.log(node, 'nnnnnn')
      params.rootId = node.rootId ? node.rootId : node.id
      params.parentId = node.id
    } else {
      if (currentOrgType.value === 7) {
        params.projectId = currentOrgId.value
      } else {
        params.orgId = currentOrgId.value
      }
    }
    if (node?.id) {
      const [err, data] = await getSubitemTreeById(params).run()
      if (err) return {}
      return { data: data }
    } else {
      const [err, data] = await getSubitemTree(params).run()
      if (err) return {}
      tempTree.value = data
      return { data: data }
    }
  }
  // ??????
  const requestfilterTree = async (keyword: string) => {
    if (!keyword) return []
    const [err, data] = await getGradeByFilter({ projectId, orgId: currentOrgId.value, content: keyword }).run()
    if (err) return []
    return data
  }

  // ????????????????????????
  const refreshNodeByHand = (newid?: any) => {
    if (!newid) return
    console.log(newid, isTreeChild.value, '999')
    console.info($subitemTree.value?.treeRef)
    const id: any = isTreeChild.value ? treeNode.value?.id : treeNode.value?.parentId
    console.log(treeNode, 'treeNode')
    console.log(id, 'id')
    console.log($subitemTree.value)
    const node: any = $subitemTree.value?.treeRef?.getNode(id)
    if (node) {
      console.log('node')
      node.loaded = false
      if (isTreeChild.value) {
        node.expand()
      }
      node.loadData()
      currentItem.value = newid
      onView({ id: newid })
    } else {
      if (!isTreeChild.value) {
        currentItem.value = newid
        onView({ id: newid })
      }
      resetLoadTree()
    }
  }
  // ????????????
  const handleDelConfirm = async () => {
    const reqData = {
      id: delRecordId.value,
    }
    const [error, data] = await delSubitem(reqData).run()
    if (!error) {
      DasMessage.success('????????????????????????')
      resetLoadTree()
    }
    delVisible.value = false
    delRecordId.value = ''
  }
  // ????????????
  const handleDelCancel = () => {
    delVisible.value = false
    delRecordId.value = ''
  }
  // ??????
  const handleAdd = () => {
    updateNodeType.value = 'self'
    editStatus.value = 'add'
    editVisible.value = true
  }
  const handleCloseEdit = (isQuery: boolean, id?: any) => {
    console.log('handleCloseEdit')
    editVisible.value = false
    if (isQuery) {
      refreshNodeByHand(id)
    }
  }
  const handleOperation = (item: any, node: Node, data: any) => {
    treeNode.value = data
    isTreeChild.value = false
    updateNodeType.value = 'self'
    const fnMap = {
      add: onAddBase,
      addItem: addChild,
      edit: onEdit,
      delete: onDelete,
    }
    fnMap[item.value](data)
  }
  // ??????????????????
  const getNodeInfo = async (item: any, updateType: string = 'view') => {
    if (!item || !item.id) return
    const [err, data] = await getSubitemInfo({ id: item.id }).run()
    console.log(data, 'x')
    if (err) return
    if (!data) return
    if (updateType === 'view') {
      objAssign(infoDataView.value, data)
      if (data.identifier) {
        infoDataView.value.dimensionName = data.name
      } else {
        infoDataView.value.gradeName = data.name
        infoDataView.value.gradeCode = data.dimensionCode
        infoDataView.value.parentGradeId = data.parentId
        infoDataView.value.parentGradeName = data.parentName
        infoDataView.value.belongDimensionId = data.rootId
        infoDataView.value.belongDimensionName = data.rootName
      }
    } else if (updateType === 'edit') {
      objAssign(infoData.value, data)
      if (data.identifier) {
        infoData.value.dimensionName = data.name
      } else {
        infoData.value.gradeName = data.name
        infoData.value.gradeCode = data.dimensionCode
        infoData.value.parentGradeId = data.parentId
        infoData.value.parentGradeName = data.parentName
        infoData.value.belongDimensionId = data.rootId
        infoData.value.belongDimensionName = data.rootName
      }
    }
  }
  const resetEditInfo = () => {
    infoData.value = {
      id: '',
      identifier: true,
      orgId: '',
      orgName: '',
      dimensionName: '',
      dimensionCode: '',
      gradeName: '',
      gradeCode: '',
      belongOrgName: '',
      belongDimensionId: '',
      belongDimensionName: '',
      parentGradeId: '',
      parentGradeName: '',
      description: '',
    }
  }
  const resetViewInfo = () => {
    infoDataView.value = {
      id: '',
      identifier: true,
      orgId: '',
      orgName: '',
      dimensionName: '',
      dimensionCode: '',
      gradeName: '',
      gradeCode: '',
      belongOrgName: '',
      belongDimensionId: '',
      belongDimensionName: '',
      parentGradeId: '',
      parentGradeName: '',
      description: '',
    }
  }
  // ????????????
  const onAddBase = (data: any) => {
    updateNodeType.value = 'self'
    resetEditInfo()
    editVisible.value = true
    editStatus.value = 'add'
    if (!data) return
    console.log(data, 'onAddBase')
    infoData.value.identifier = data.identifier
    if (data.identifier) {
      // ??????????????????
      // infoData.value.identifier = data.identifier
    } else {
      // ??????????????????
      infoData.value.belongDimensionId = data.rootId
      infoData.value.belongDimensionName = data.rootName
    }
  }
  // ???????????????
  const addChild = (data: any) => {
    updateNodeType.value = 'parent'
    resetEditInfo()
    isTreeChild.value = true
    editVisible.value = true
    editStatus.value = 'add'
    console.log(data, 'addchild')
    infoData.value.identifier = false
    if (data.identifier) {
      infoData.value.belongDimensionId = data.id
      infoData.value.belongDimensionName = data.name
    } else {
      infoData.value.belongDimensionId = data.rootId
      infoData.value.belongDimensionName = data.rootName
      infoData.value.parentGradeId = data.id
      infoData.value.parentGradeName = data.name
    }
  }
  // ??????
  const onEdit = (data: any) => {
    updateNodeType.value = 'self'
    resetEditInfo()
    console.log(data, 'x')
    editVisible.value = true
    editStatus.value = 'edit'
    getNodeInfo(data, 'edit')
  }

  // ??????
  const onView = (data: any) => {
    console.log(data, 'xxxx1')
    editStatus.value = 'view'
    resetViewInfo()
    getNodeInfo(data)
  }
  // ??????
  const onDelete = (data: any) => {
    delVisible.value = true
    delContent.value = `???????????????????????????????????????????????????<br>??????????????????`
    delRecordId.value = data.id
  }
  // ?????????-????????????????????????
  const getOperationsLayout = (node: Node, data: any) => {
    // ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    // ??????????????????????????????????????????????????????????????????????????????????????????????????????
    // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    // ?????????????????????????????????????????????????????????????????????????????????????????????????????????
    if (data.orgId === currentOrgId.value) {
      return 'add,addItem,edit,delete'
    }
    if (data.orgId !== currentOrgId.value) {
      return 'add,addItem'
    }
  }

  // ???????????? ?????????????????? ????????????????????????????????????????????????
  const dragBrotherNode = (draggingNode: any, dropNode: any, type: string) => {
    if (draggingNode.level === dropNode.level && type !== 'inner') {
      return true
    } else {
      return false
    }
  }
  // ???????????? ??????????????????
  const dragStart = (node: any, event: any) => {}
  // ???????????? ??????????????????
  const dragFinish = async (before: any, after: any, inner: any) => {
    if (!before.data) return

    const startSort: number = Number(before.data.rank)
    const endSort: number = Number(after.data.rank)

    // before?????????????????????after???????????????????????????
    console.log(before, after, 'before')
    // ???dropType!= inner,???????????????????????????????????????????????????
    // ???dropType==inner????????????????????????????????????????????????????????????????????????

    let brotherNodes: anyObjectT[] = []
    let indexValue = []
    if (isEmpty(after.data.parentId)) {
      // ?????????????????????
      brotherNodes = tempTree.value.map((e: any, index: number) => {
        return {
          spaceId: e.id,
          name: e.name,
          sort: e.rank,
        }
      })
      console.log(brotherNodes, 'sss')
      const startIndex = tempTree.value.findIndex((e: any) => {
        return e.id === before.data.id
      })
      const endIndex = tempTree.value.findIndex((e: any) => {
        return e.id === after.data.id
      })
      indexValue = brotherNodes.map((item: any) => item.sort)
      brotherNodes = swapArray(brotherNodes, startIndex, endIndex)
    } else {
      const node: any = $subitemTree.value?.treeRef?.getNode(after.data.parentId)
      console.log(node, 'nodee')
      if (node && node.childNodes) {
        brotherNodes = toRaw(node.childNodes).map((item: any, index: number) => {
          return {
            spaceId: item.data.id,
            name: item.data.name,
            sort: item.data.rank,
          }
        })
        const startIndex = brotherNodes.findIndex((e: any) => {
          return e.spaceId === before.data.id
        })
        const endIndex = brotherNodes.findIndex((e: any) => {
          return e.spaceId === after.data.id
        })
        indexValue = brotherNodes.map((item: any) => item.sort)
        indexValue = swapArray(indexValue, endIndex, startIndex)
      }
    }
    console.log('node', brotherNodes, startSort, endSort)
    const ids = brotherNodes.map((item: any) => item.spaceId)
    const name = brotherNodes.map((item: any) => item.name)
    await requestDragSort(ids, indexValue)
    console.log('ids', ids)
    console.log('indexValue', indexValue)
    console.log('name', name)
  }
  // ??????????????????
  const requestDragSort = async (ids: number[], index: any) => {
    const params = {
      ids: ids,
      ranks: index,
    }
    const [err, data] = await sortSubitem(params).run()
    if (err) return
  }

  return {
    delContent,
    delVisible,
    editVisible,
    editStatus,
    handleAdd,
    handleDelConfirm,
    handleDelCancel,
    handleCloseEdit,
    currentItem,
    treeData,
    keyword,
    currentPath,
    load,
    requestfilterTree,
    handleClickTreeNode,
    dragStart,
    dragFinish,
    dragBrotherNode,
    orgTreeData,
    currentOrgId,
    orgKeyword,
    OrgPathValue,
    handleClickOrg,
    getOperationsLayout,
    handleOperation,
  }
}
