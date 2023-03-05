import type { Options } from '../../constants'

export type Columns = {
  label: string
  prop: string
  contentType?: 'link'
  onClickLink?: (row: any) => void
  render?: (scope: { row: any; $index: number }) => JSX.Element
  enums?: Record<string, any>
}[]

export type Emits = {
  ($event: 'view', row: any)
  ($event: 'edit', row: any)
  ($event: 'delete', row: any)
}

export type Props = {
  columns: Columns
  loadData: (params: InitDataParamsType) => Promise<{ total: number; data: any[] }>
}

export type TablePageType = {
  curPage: number
  pageSize: number
  total: number
}

export type InitDataParamsType = Partial<{
  tablePage: TablePageType
  filterObj: Record<string, any>
}>

export type TableAction = 'edit' | 'delete' | 'view'
