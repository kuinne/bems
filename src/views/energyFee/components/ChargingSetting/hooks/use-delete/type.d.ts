import { ComputedRef } from 'vue'

export type Props = {
  visible: boolean
  formData: any
}

export type Emits = {
  ($event: 'close'): void
  ($event: 'confirm'): void
}

export type UseDeleteOptions = {
  onConfirm?: () => void
}
