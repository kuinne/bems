const bemsBase = `/api/bems/data-manage/v1`

import { createService } from '@/utils/api-services/src/create-service'
import { getProjectInfo } from '@/utils/common-info'

const service = createService(`${bemsBase}/energy-type`)

const projectId = getProjectInfo() ? getProjectInfo().id : 1

const baseParams = {
  projectId,
}

/** 获取所有能源类型 */

export const getAllEnergyType = () => {
  return service.get(`get-all?projectId=${baseParams.projectId}`)().run()
}
