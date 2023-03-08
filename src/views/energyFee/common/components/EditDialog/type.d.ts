export type FormItem = {
  prop: string
  label: string
  required?: boolean
  type: string
  maxLength?: number
  col?: number
  showWordLimit?: boolean
  validator?: (val: any) => string | undefined
  getPopupContainer?: any
  render?: () => JSX.Element
  isRight?: boolean
  options?: { value: any; label: string }[]
}

export type FormItems = (FormItem | ((formData: any) => FormItem))[]

export type Props = {
  visible: boolean
  formData: any
  type: 'edit' | 'view' | 'add'
  title: string
  formItems: FormItems
}

export type Emits = {
  ($event: 'close'): void
  ($event: 'submit', data: any): void
}

export type UseEditOptions = {
  onSubmit?: () => void
}
