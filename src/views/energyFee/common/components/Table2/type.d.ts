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
  (
    $event: 'update:page',
    page: {
      pageSize: number
      curPage: number
    },
  )
  ($event: 'update:selectionRows', selectionRows: any[]): void
}

export type Props = {
  columns: Columns
  data: any[]
  page: {
    pageSize: number
    curPage: number
  }
  selectionRows: any[]
  total: number
  loading: boolean
  actions?: TableAction[]
}

export type TablePageType = {
  curPage: number
  pageSize: number
  total: number
}

export type TableAction = 'edit' | 'delete' | 'view'
