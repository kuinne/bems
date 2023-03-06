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
