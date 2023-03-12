/** 计费方式 */
export enum BillingMethod {
  /** 固定单价 */
  Fixed = '1',
  /** 分时单价 */
  Time = '2',
}

/** 表计类型 */
export enum MeterType {
  /** 全部 */
  ALL = -1,
  /** 实体表计 */
  Entity = 1,
  /** 虚拟表计 */
  Virtual = 2,
}
