import { BillingMethod } from './enums'

/** 分时单价集合 */
export interface UnitPriceDtos {
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
  /** 单价 */
  price: string
  /** 备注 */
  remark: string
}

/** 计费设置 */
export interface CharingSetting {
  id?: string
  /** 计费标准名称 */
  name: string
  /** 能源分类 */
  energyTypeId: string
  /** 计费方式 */
  billingMethod: BillingMethod
  /** 单价(仅在计费方式为固定单价时有值) */
  unitPriceDtos?: UnitPriceDtos[]
  unitPrice?: string
  /** 备注 */
  remark?: string
}
