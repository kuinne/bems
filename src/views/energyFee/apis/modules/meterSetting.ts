const bemsBase = `/api/bems/data-manage/v1`

import { createService } from '@/utils/api-services/src/create-service'
import { getProjectInfo } from '@/utils/common-info'

const service = createService(`${bemsBase}/energy-billing`)

const projectId = getProjectInfo() ? getProjectInfo().id : 1

const baseParams = {
  projectId,
}

/** 导入模板下载 */

export const downloadMeterSettingImportTemplate = (params: { taskId: string }) => {
  return service
    .get(`branch/download/template?projectId=${baseParams.projectId}`, (config: any) => {
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

/** 表计设置-导出 */
export const exportMeterSetting = (params: { taskId: string }) => {
  return service.post(`meter-billing/export?projectId=${baseParams.projectId}&taskId=${params.taskId}`)().run(params)
}

/** 表计设置-能源tree */
export const getMeterSettingTree = () => {
  return service
    .get('meter-billing/tree')()
    .run({
      ...baseParams,
    })
}

/** 表计设置-列表 */
export const getMeterSettingList = (params: { pageIndex: number; pageSize: number; energyBillingSettingId: string; meterType?: string; search?: string }) => {
  return service
    .post(`meter-billing/page?projectId=${baseParams.projectId}`)()
    .run({
      ...params,
    })
}

/** 表计设置-删除 */

export const deleteMeterSetting = (params: { ids: string[] }) => {
  return service.delete(`meter-billing?projectId=${baseParams.projectId}`)().run(params)
}

/** 表计设置-新增 */

export const addMeterSetting = (params: {
  /** 表计id */
  meterId: string
  /** 计费设置id */
  energyBillingSettingId: string
}) => {
  return service.post(`meter-billing?projectId=${baseParams.projectId}`)().run(params)
}
