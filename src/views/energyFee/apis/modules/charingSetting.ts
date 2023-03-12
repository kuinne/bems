const bemsBase = `/api/bems/data-manage/v1`

import { createService } from '@/utils/api-services/src/create-service'
import { getProjectInfo } from '@/utils/common-info'
import { CharingSetting } from '../components/ChargingSetting/type'

const service = createService(`${bemsBase}/energy-billing`)

const projectId = getProjectInfo() ? getProjectInfo().id : 1

const baseParams = {
  projectId,
}

/** 获取全部标准（能源分类) */
export const getEnergyType = () => {
  // return service
  //   .get('setting/energy-type')()
  //   .run({
  //     ...baseParams,
  //   })
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        null,
        [
          {
            id: '1',
            name: '水',
            count: 0,
            children: [
              {
                id: '1-1',
                name: '水1111',
                count: 11,
              },
            ],
          },
          {
            id: '2',
            name: '电',
            count: 0,
            children: [
              {
                id: '2-1',
                name: '电1111',
                count: 11,
              },
            ],
          },
        ],
      ])
    }, 1500)
  })
}

/** 计费设置-查看  */
export const viewSetting = (params: { id: string }) => {
  // return service.get(`setting?projectId=${baseParams.projectId}`)().run(params)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        null,
        {
          id: '0',
          name: 'sss',
          energyTypeName: 'zzz',
          billingMethod: '1',
          remark: 'zzzzzz',
        },
      ])
    }, 2000)
  })
}

/** 计费设置-列表 */
export const getSetting = (params: { pageIndex: number; pageSize: number; energyTypeId: string }) => {
  // return service
  //   .get('setting/page')()
  //   .run({
  //     ...params,
  //     ...baseParams,
  //   })
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        null,
        {
          records: new Array(40).fill(undefined).map((item, index) => ({
            id: index,
            name: 'sss' + index,
            energyTypeName: 'zzz',
            billingMethod: '1',
            remark: 'zzzzzz',
          })),
          total: 40,
        },
      ])
    }, 1500)
  })
}

/** 计费设置-新增 */
export const createSetting = (params: CharingSetting) => {
  return service
    .post(`setting?projectId=${baseParams.projectId}`)()
    .run({
      ...params,
    })
}

/** 计费设置-编辑 */
export const updateSetting = (params: CharingSetting) => {
  // return service.put(`setting?projectId=${baseParams.projectId}`)().run(params)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([null, 'ok'])
    }, 1500)
  })
}

/** 计费设置-删除 */
export const deleteSetting = (params: { ids: string[] }) => {
  // return service.delete(`setting?projectId=${baseParams.projectId}`)().run(params)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([null, 'ok'])
    }, 1500)
  })
}
