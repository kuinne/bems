const version = 'v1'
const bemsBase = `/api/bems/data-manage`

import { createService } from '@/utils/api-services/src/create-service'
import { getProjectInfo } from '@/utils/common-info'

const service = createService(`${bemsBase}/${version}/common`)

const projectId = getProjectInfo() ? getProjectInfo().id : 1

const baseParams = {
  projectId,
}

/** 获取表计信息 */

export const getMeterInfoList = (params: {
  pageIndex: number
  pageSize: number
  list: {
    /** 能源编码 */
    typeCode: string
    /** 能源维度id没有传-1 */
    dimensionId: string
    /** 对象id， isObj 为true时传*/
    objId: string
    /** 能源层级id 没有传-1, isObj为false时传 */
    gradationId: string
    objectName: string
  }[]
}) => {
  return service.post(`meter-info/page?projectId=${baseParams.projectId}&pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`)().run(params.list)
}

/** 获取绑定有表计的对象和层级树 */

export const getObjTree = (params: {
  /** 能源类型id */
  energyTypeId: string
  /** 维度id */
  dimensionId: string
}) => {
  return service.get(`meter/obj-tree?projectId=${baseParams.projectId}`)().run(params)
}

/** 获取有表计的能源维度 */

export const getDimension = (params: { energyTypeId: string }) => {
  return service.get(`meter/dimension?projectId=${baseParams.projectId}`)().run(params)
}
