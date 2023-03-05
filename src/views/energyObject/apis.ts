import { bemsModules } from '@/utils/api-services'
import { getProjectInfo } from '@/utils/common-info'
// export const projectId = '19999990'
export const projectId = getProjectInfo() ? getProjectInfo().id : 1
export const projectName = getProjectInfo() ? getProjectInfo().name : '测试项目'

const service = bemsModules.energyObject

// 获取对象树-根
export const getObjectTreeRoot = service.get('get-tree-roots')
// 获取对象树-子节点
export const getObjectTreeLeaf = service.get('get-tree-leaf')
// 查询对象节点详情
export const getObjectNodeInfo = service.get('get-object-detail')
// 搜索对象树
export const getObjectTreeByFilter = service.get('search-object')
// 对象节点排序
export const sortTree = service.patch('change-ranking')


// 新增/编辑
export const addOrUpdateObject = service.post('create-or-update')
// 删除
export const delObject = service.delete('cascade-delete')
