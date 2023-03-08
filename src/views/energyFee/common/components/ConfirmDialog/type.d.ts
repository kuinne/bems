export type Props = {
  // visible: boolean
  content?: string
  title?: string
  type?: 'primary' | 'warning' | 'danger' | 'delete'
}

export type Emits = {
  ($event: 'close'): void
  ($event: 'confirm'): void
  ($event: 'update:visible', val: boolean): void
}
