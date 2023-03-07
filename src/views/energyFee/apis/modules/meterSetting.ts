const version = 'v1'
const bemsBase = `/api/bems/data-manage`

import { createService } from '@/utils/api-services/src/create-service'
import { getProjectInfo } from '@/utils/common-info'
import { CharingSetting } from '../components/ChargingSetting/type'

const service = createService(`${bemsBase}/energy-billing`)

export const projectId = getProjectInfo() ? getProjectInfo().id : 1

const baseParams = {
  projectId,
}

const mockData: any = {
  list: [
    {
      id: Math.random().toString().slice(16),
      name: '大放送',
      energyTypeId: '1',
      billingMethod: '1',
      unitPriceDtos: [],
      unitPrice: '0.001',
      remark: 'ss',
    },
    {
      id: Math.random().toString().slice(16),
      name: '分身乏术分',
      energyTypeId: '2',
      billingMethod: '2',
      unitPriceDtos: [],
      unitPrice: '0.101',
      remark: '冯绍峰开始放家里说',
    },
  ],
}

/** 导入模板下载 */

export const downloadMeterSettingImportTemplate = (params: { taskId: string }) => {
  return service
    .get(`branch/download/template`, (config: any) => {
      config.responseType = 'blob'
      return config
    })()
    .run({
      ...params,
    })
}

/** 表计设置-导入 */

export const importMeterSetting = (params: { fileName: string; taskId: string; energyBillingSettingId: string }) => {
  return service
    .get(`meter-billing/import`)()
    .run({
      ...params,
      ...baseParams,
    })
}

/** 表计设置-能源tree */
export const getMeterSettingTree = () => {
  // return service
  //   .get('meter-billing/tree')()
  //   .run({
  //     ...baseParams,
  //   })
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        '',
        [
          {
            name: '水',
            id: '1',
            count: 4,
          },
          {
            name: '电',
            id: '2',
            count: 2,
          },
          {
            name: '冷',
            id: '3',
            count: 1,
          },
        ],
      ])
    }, 1000)
  })
}

/** 表计设置-列表 */
export const getMeterSettingList = (params: { pageIndex: number; pageSize: number; energyBillingSettingId: string; meterType?: string; search?: string }) => {
  // return service
  //   .post(`meter-billing/page?projectId=${baseParams.projectId}`)()
  //   .run({
  //     ...params,
  //   })
  return new Promise<[any, any]>((resolve) => {
    const data = mockData.list.filter((item: any) => {
      return true
    })

    setTimeout(() => {
      resolve([
        '',
        {
          records: data,
          total: data.length,
        },
      ])
    }, 1000)
  })
}
