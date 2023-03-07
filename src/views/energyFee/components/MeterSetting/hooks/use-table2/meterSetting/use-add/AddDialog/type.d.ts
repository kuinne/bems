export type Props = {
  visible: boolean
  type: 'edit' | 'view' | 'add'
  title: string
}

export type Emits = {
  ($event: 'close'): void
  ($event: 'submit', data: any): void
}
