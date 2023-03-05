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

/** 获取全部标准（能源分类) */
export const getEnergyType = () => {
  // return service
  //   .get('setting/energy-type')()
  //   .run({
  //     ...baseParams,
  //   })
  return Promise.resolve<[any, any[]]>([
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
}

/** 计费设置-查看  */
export const viewSetting = (params: { id: string }) => {
  return service.get('setting')().run(params)
}

/** 计费设置-列表 */
export const getSetting = (params: { pageIndex: number; pageSize: number; energyTypeId: string }) => {
  // return service
  //   .get('setting/page')()
  //   .run({
  //     ...params,
  //     ...baseParams,
  //   })
  return new Promise<[any, any]>((resolve) => {
    const data = mockData.list.filter((item: any) => {
      if (params.energyTypeId === '-1') return true
      return item.energyTypeId === params.energyTypeId
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

/** 计费设置-新增 */
export const createSetting = (params: CharingSetting) => {
  // return service
  //   .post(`setting?projectId=${baseParams.projectId}`)()
  //   .run({
  //     ...params,
  //   })
  const item = {
    ...params,
    id: Math.random().toString().slice(16),
  }
  mockData.list.push(item)
  return Promise.resolve<[any, any]>(['', item])
}

/** 计费设置-编辑 */
export const updateSetting = (params: CharingSetting) => {
  // return service.put('setting')().run(params)
  let index = mockData.list.findIndex((item: any) => item.id === params.id)
  let item = mockData.list[index]
  if (item) {
    item = {
      ...item,
      ...params,
    }
  }
  mockData.list.splice(index, 1, item)

  return Promise.resolve<[any, any]>(['', item])
}

/** 计费设置-删除 */
export const deleteSetting = (params: { ids: string[] }) => {
  // return service.delete('setting')().run(params)
  mockData.list = mockData.list.filter((item: any) => !params.ids.includes(item.id))
  return Promise.resolve<[any, any]>(['', ''])
}
