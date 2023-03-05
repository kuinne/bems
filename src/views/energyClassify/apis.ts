import { bemsModules} from '@/utils/api-services'

const service = bemsModules.energyType

// 能源分类分页查询
export const getTypeList = service.get('get-list')

// 新增/编辑
export const updateType = service.post('create-or-update')

// 删除
export const delType = service.delete('delete-by-id')
