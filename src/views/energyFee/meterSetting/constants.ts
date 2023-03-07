import { MeterType } from './enums'

export type Options<K, V = string> = Array<{
  value: K
  label: V
  disabled?: boolean
}>

export const meterTypeOptions: Options<MeterType> = [
  { value: MeterType.ALL, label: '全部' },
  { value: MeterType.Entity, label: '实体表计' },
  { value: MeterType.Virtual, label: '虚拟表计' },
]

export const charingTypeOptions = []
