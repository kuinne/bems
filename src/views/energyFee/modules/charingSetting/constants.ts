import { BillingMethod } from './enums'

export type Options<K, V = string> = Array<{
  value: K
  label: V
  disabled?: boolean
}>

export const charingTypeOptions: Options<BillingMethod> = [
  { value: BillingMethod.Fixed, label: '固定单价' },
  { value: BillingMethod.Time, label: '分时单价' },
]
