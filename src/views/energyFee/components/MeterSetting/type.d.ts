import { BillingMethod } from './enums'

/** 表计设置 */
export interface MeterSetting {
  id?: string
  /** 表计名称 */
  meterName: string
  /** 表计编码 */
  meterCode: string
  /** 能源分类id */
  energyTypeId: string
  /** 能源分类名称 */
  energyTypeName: string

  /** 表计类型 */
  meterType: string
  /** 表计类型名称 */
  meterTypeName: string
  /** 表计状态 */
  status: string

  isEnable: boolean
}
