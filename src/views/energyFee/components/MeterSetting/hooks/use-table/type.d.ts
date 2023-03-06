import type { Options } from '../../constants'
import { MeterType } from '../../enums'

export type FilterObj = Partial<{
  tablePage: any
  filterObj: Partial<{
    energyBillingSettingId: string
    meterType: MeterType
    search: string
  }>
}>

export type UseTableOptions<T> = {
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onView?: (row: T) => void
  energyTypeOptions: Ref<Options<any>>
  energyBillingSettingId: Ref<number | undefined>
  filterObj: Ref<any>

  slots?: Partial<{
    default: () => any
    header: () => any
  }>
}
