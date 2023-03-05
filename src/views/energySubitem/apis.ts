import { enterpriseright, bemsModules } from '@/utils/api-services'
import { getProjectInfo } from '@/utils/common-info'
// export const projectId = '19999990'
export const projectId = getProjectInfo() ? getProjectInfo().id : 1
export const projectName = getProjectInfo() ? getProjectInfo().name : '测试项目'

const service = bemsModules.energyDimension

/** 获取登录用户 可查看 组织机构树 */
export const getAuthTree = enterpriseright.get(`/organization/authTree`)
// 根据id查询组织详情
export const getOrgInfo = enterpriseright.get(`/organization/detail`)

// 新增层级
export const addGrade = service.post('create-gradation')

// 编辑维度/层级
export const editGradeOrDimension = service.patch('update-dimension')
// 新增维度
export const addDimension = service.post('create-dimension')
// 获取分项根节点树
export const getSubitemTree = service.get('get-dimension')
// 获取分项子节点
export const getSubitemTreeById = service.get('get-gradation-by-Id')
// 搜索分项
export const getGradeByFilter = service.get('search')
// 查询分项节点详情
export const getSubitemInfo = service.get('get-dimension-detail')
// 分项节点排序
export const sortSubitem = service.patch('change-ranking')

// 删除
export const delSubitem = service.delete('delete')
