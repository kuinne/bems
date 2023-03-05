type SelectOptions = { value: any; label: string; disabled?: boolean }[]

type TableColumns = (
  | {
      label: string
      prop: string
      type?: 'input'
      required?: boolean
      validator?: (val: any) => string | undefined
    }
  | {
      label: string
      prop: string
      type: 'select'
      required?: boolean
      options: ((row: any) => selectionOptions) | SelectOptions
      validator?: (val: any) => string | undefined
    }
)[]

export interface Props {
  modelValue: any
  columns: TableColumns
  defaultData: any
  isView?: boolean
}

export interface Emits {
  (e: 'update:modelValue', val: any): void
}
