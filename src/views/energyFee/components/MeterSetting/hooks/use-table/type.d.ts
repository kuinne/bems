import type { Options } from '../../constants'

export type FilterObjType = Partial<{
  /** 能源类型Id,-1查询全部 */
  energyTypeId: string
}>

export type UseTableOptions<T> = {
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onView?: (row: T) => void
  energyTypeOptions: Ref<Options<any>>

  slots?: Partial<{
    default: () => any
    header: () => any
  }>
}
