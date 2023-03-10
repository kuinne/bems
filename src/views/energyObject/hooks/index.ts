import { Ref, ref, nextTick, SetupContext, provide, onMounted, toRaw } from 'vue'
import { DasMessage, DasTreeRef } from '@/das-fe/ui'
import { getObjectTreeRoot, getObjectTreeLeaf, getObjectTreeByFilter, sortTree, getObjectNodeInfo, delObject, projectId } from '../apis'
import { isEmpty, objAssign, anyObjectT, swapArray } from './common'
import type { TreeProps, ObjectT } from '../components/tree'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { start } from 'repl'

export const basicEmits = ['update:visible', 'closeDialog']
export type BasicEmits = typeof basicEmits
export type ruleInfoT = {
  id: any
  parentId: any
  parentName: any
  objectName: any
  objectCode: any
  sorting: any
  enable: any
  structureArea: any
  settledStructureArea: any
  coldArea: any
  settledColdArea: any
  warmArea: any
  settledWarmArea: any
  residents: any
  pictureUrl: any
  description: any
}
type ObjectRelatedObj = {
  editStatus: Ref<string>
  delContent: Ref<string>
  delVisible: Ref<boolean>
  editVisible: Ref<boolean>
  infoData: Ref<ruleInfoT>
  handleDelConfirm: (n: string) => void
  handleDelCancel: () => void
  handleAdd: () => void
  handleUpdateTree: () => void
  handleCloseEdit: (n: any, id: any) => void
  treeData: Ref<any>
  currentItem: Ref<string>
  keyword: Ref<string>
  getOperationsLayout: (m: any, n: any) => any
  handleOperation: (m: any, n: any, h: any) => void
  currentPath: Ref<string>
  load: (n: any) => Promise<any>
  requestfilterTree: (n: any) => Promise<any>
  handleClickTreeNode: (n: any) => void
  dragStart: (n: any, m: any) => void
  dragFinish: (n: any, m: any, h: any) => void
  dragBrotherNode: (n: any, m: any, h: string) => void
}
export let editStatus = ref<string>('')
export let editVisible = ref(false)
export let infoData = ref({
  id: '',
  parentId: '',
  parentName: '',
  objectName: '',
  objectCode: '',
  sorting: '1',
  enable: false,
  structureArea: '0',
  settledStructureArea: '0',
  coldArea: '0',
  settledColdArea: '0',
  warmArea: '0',
  settledWarmArea: '0',
  residents: '0',
  pictureUrl: '',
  description: '',
})
export let infoDataView = ref({
  id: '',
  parentId: '',
  parentName: '',
  objectName: '',
  objectCode: '',
  sorting: '1',
  enable: false,
  structureArea: '0',
  settledStructureArea: '0',
  coldArea: '0',
  settledColdArea: '0',
  warmArea: '0',
  settledWarmArea: '0',
  residents: '',
  pictureUrl: '',
  description: '',
})
export let treeData = ref<any>([])
export const useEnergyObject = ($objectTree: any): ObjectRelatedObj => {
  onMounted(() => {
    initTree()
  })
  // ?????????
  const treeNode = ref<TreeProps>()
  // ????????????
  const isTreeChild = ref(false)
  let currentItem = ref<string>('')
  let currentPath = ref<string>('')
  let keyword = ref<string>('')
  // ???????????????
  const initTree = async () => {
    const [err, data] = await getObjectTreeRoot({ projectId }).run()
    if (err) return {}
    currentItem.value = data && data.length > 0 ? data[0].id : ''
    getNodeInfo({ id: currentItem.value })
  }
  // ???????????????
  const resetLoadTree = () => {
    $objectTree.value?.resetLazyLoad()
  }
  // ???????????????
  const handleClickTreeNode = (val: any) => {
    onView(val)
  }
  // ?????????
  let tempTree = ref([])
  const load = async (node?: any) => {
    let params: ObjectT = { projectId, needDetail: true }
    if (node?.id) {
      params.objectId = node.id
    }
    if (node?.id) {
      const [err, data] = await getObjectTreeLeaf(params).run()
      if (err) return {}
      return { data: data }
    } else {
      const [err, data] = await getObjectTreeRoot(params).run()
      tempTree.value = data
      if (err) return {}
      return { data: data }
    }
  }
  // ?????????
  const requestfilterTree = async (name: string) => {
    if (!name) return []
    const [err, data] = await getObjectTreeByFilter({ projectId, objectName: name }).run()
    if (err) return []
    return data
  }
  // ????????????????????????
  const refreshNodeByHand = (newid?: any) => {
    console.log('999')
    console.info($objectTree.value?.treeRef)
    console.log(treeNode.value,'treeNode')
    const id: any = isTreeChild.value ? treeNode.value?.id : treeNode.value?.current?.parentId
    console.log($objectTree.value)
    const node: any = $objectTree.value?.treeRef?.getNode(id)
    if (node) {
      node.loaded = false
      if (isTreeChild.value) {
        node.expand()
      }
      node.loadData()
      currentItem.value = newid
      onView({ id: newid })
    } else {
      if(!isTreeChild.value){
        currentItem.value = newid
        onView({ id: newid })
      }
      resetLoadTree()
    }
  }

  // ??????
  const delVisible = ref<boolean>(false)
  const delRecordId = ref<string>('')
  const delNode = ref<Node>()
  let delContent = ref('')

  // ????????????
  const handleDelConfirm = async () => {
    const reqData = {
      objectId: delRecordId.value,
      projectId: projectId,
    }
    const [error, data] = await delObject(reqData).run()
    if (!error) {
      DasMessage.success('????????????????????????')
      initTree()
      handleUpdateTree()
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
    editStatus.value = 'add'
    editVisible.value = true
  }
  const handleCloseEdit = (isQuery: boolean, data: any) => {
    console.log('handleCloseEdit')
    editVisible.value = false
    if (isQuery) {
      // getTreeData()
      console.log($objectTree, 'dd')
      refreshNodeByHand(data)
    }
  }
  const handleOperation = (item: any, node: Node, data: any) => {
    treeNode.value = data
    isTreeChild.value = false
    const fnMap = {
      add: onAddBase,
      addItem: addChild,
      edit: onEdit,
      delete: onDelete,
    }
    fnMap[item.value](data)
  }
  const resetEditInfo = () => {
    infoData.value = {
      id: '',
      parentId: '',
      parentName: '',
      objectName: '',
      objectCode: '',
      sorting: '1',
      enable: false,
      structureArea: '0',
      settledStructureArea: '0',
      coldArea: '0',
      settledColdArea: '0',
      warmArea: '0',
      settledWarmArea: '0',
      residents: '0',
      pictureUrl: '',
      description: '',
    }
  }
  const resetViewInfo = () => {
    infoDataView.value = {
      id: '',
      parentId: '',
      parentName: '',
      objectName: '',
      objectCode: '',
      sorting: '1',
      enable: false,
      structureArea: '0',
      settledStructureArea: '0',
      coldArea: '0',
      settledColdArea: '0',
      warmArea: '0',
      settledWarmArea: '0',
      residents: '0',
      pictureUrl: '',
      description: '',
    }
  }
  // ????????????
  const onAddBase = (data: any) => {
    resetEditInfo()
    editVisible.value = true
    editStatus.value = 'add'
    if (!data) return
    infoData.value.parentName = data.current.parentName
    infoData.value.parentId = data.current.parentId
  }
  // ????????????
  const addChild = (data: any) => {
    resetEditInfo()
    isTreeChild.value = true
    editVisible.value = true
    editStatus.value = 'add'
    infoData.value.parentName = data.name
    infoData.value.parentId = data.id
  }
  // ??????
  const onEdit = (data: any) => {
    resetEditInfo()
    console.log(data, 'x')
    editVisible.value = true
    editStatus.value = 'edit'
    getNodeInfo(data, 'edit')
  }

  // ??????
  const onView = async (data: any) => {
    console.log(data, 'xxxx1')
    resetViewInfo()
    currentItem.value = data.id
    editStatus.value = 'view'
    getNodeInfo(data)
  }
  const getNodeInfo = async (item: any, updateType: string = 'view') => {
    if (!item || !item.id) return
    const [err, data] = await getObjectNodeInfo({ id: item.id }).run()
    console.log(data, 'x')
    if (err) return
    if (updateType === 'view') {
      editStatus.value = 'view'
      objAssign(infoDataView.value, data)
      infoDataView.value.objectName = data.name
      infoDataView.value.id = data.id
    } else {
      objAssign(infoData.value, data)
      infoData.value.objectName = data.name
      infoData.value.id = data.id
    }
  }
  // ??????
  const onDelete = (data: any) => {
    delVisible.value = true
    delContent.value = `????????????????????????<br>??????????????????`
    delRecordId.value = data.id
  }
  const getOperationsLayout = (node: Node, data: any) => {
    if (node.level === 1) return 'addItem,edit'
    if (data.id.includes('add')) return 'add,delete'
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
  const dragStart = (node: any, event: any) => {
    console.log('startNode')
  }

  // ???????????? ??????????????????
  const dragFinish = async (before: any, after: any, inner: any) => {
    if (!before.data || !before.data.current) return

    const startSort: number = Number(before.data.current.rank)
    const endSort: number = Number(after.data.current.rank)

    // before?????????????????????after???????????????????????????
    console.log(before, after, 'before')
    // ???dropType!= inner,???????????????????????????????????????????????????
    // ???dropType==inner????????????????????????????????????????????????????????????????????????

    let brotherNodes: anyObjectT[] = []
    let indexValue = []
    if (isEmpty(after.data.current.parentId)) {
      // ?????????????????????
      brotherNodes = tempTree.value.map((e: any, index: number) => {
        return {
          spaceId: e.id,
          name: e.name,
          sort: e.current.rank,
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
      const node: any = $objectTree.value?.treeRef?.getNode(after.data.current.parentId)
      console.log(node, 'nodee')
      if (node && node.childNodes) {
        brotherNodes = toRaw(node.childNodes).map((item: any, index: number) => {
          return {
            spaceId: item.data.id,
            name: item.data.name,
            sort: item.data.current.rank,
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
    const [err, data] = await sortTree(params).run()
    if (err) return
  }

  // ???????????????
  const handleUpdateTree = () => {
    $objectTree.value?.resetLazyLoad()
  }
  return {
    infoData,
    delContent,
    delVisible,
    editVisible,
    editStatus,
    handleAdd,
    handleDelConfirm,
    handleDelCancel,
    handleCloseEdit,
    treeData,
    currentItem,
    keyword,
    getOperationsLayout,
    handleOperation,
    handleUpdateTree,
    currentPath,
    load,
    requestfilterTree,
    handleClickTreeNode,
    dragStart,
    dragFinish,
    dragBrotherNode,
  }
}
