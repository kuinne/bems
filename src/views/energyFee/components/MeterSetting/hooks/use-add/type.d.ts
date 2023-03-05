import type { Options } from './type'
import type { CharingSetting } from '../../type'
import type { ComputedRef } from 'vue'

export type Props = {
  visible: boolean
  formData: CharingSetting | null
  /** 只读状态 */
  readonly?: boolean
}

export type Emits = {
  ($event: 'close'): void
  ($event: 'submit'): void
}

export type UseAddOptions = {
  onSubmit?: () => void
  energyTypeOptions: Ref<Options>
}
