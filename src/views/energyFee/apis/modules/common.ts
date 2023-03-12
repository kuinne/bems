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
  // return service.post(`meter-info/page?projectId=${baseParams.projectId}&pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`)().run(params.list)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        null,
        {
          records: new Array(40).fill(undefined).map((item, index) => ({
            id: index,
            meterName: 'SSS',
            meterCode: '324324',
            meterTypeName: 'SFDWEFF',
            status: 0,
          })),
          total: 40,
        },
      ])
    }, 500)
  })
}

/** 获取绑定有表计的对象和层级树 */

export const getObjTree = (params: {
  /** 能源类型id */
  energyTypeId: string
  /** 维度id */
  dimensionId: string
}) => {
  // return service.get(`meter/obj-tree?projectId=${baseParams.projectId}`)().run(params)
  // return Promise.resolve([null, []])
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        null,
        [
          {
            id: '1',
            name: 'fdsfs',
            childs: [
              {
                id: '1-1',
                name: '1-1',
              },
            ],
          },
          {
            id: '2',
            name: 'fdsfs',
            childs: [
              {
                id: '2-1',
                name: '2-1',
              },
            ],
          },
          {
            id: '3',
            name: 'fdsfs',
            childs: [
              {
                id: '3-1',
                name: '2-1',
              },
            ],
          },
          {
            id: '4',
            name: 'fdsfs',
            childs: [
              {
                id: '4-1',
                name: '2-1',
              },
            ],
          },
          {
            id: '5',
            name: 'fdsfs',
            childs: [
              {
                id: '5-1',
                name: '5-1',
              },
            ],
          },
        ],
      ])
    }, 600)
  })
}

/** 获取有表计的能源维度 */

export const getDimension = (params: { energyTypeId: string }) => {
  // return service.get(`meter/dimension?projectId=${baseParams.projectId}`)().run(params)
  return Promise.resolve([
    null,
    [
      {
        id: '1',
        name: '维度1',
      },
      {
        id: '2',
        name: '维度2',
      },

      {
        id: '3',
        name: '维度3',
      },
      {
        id: '4',
        name: '维度4',
      },
    ],
  ])
}
