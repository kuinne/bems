export type Props = {
  options: {
    key: string
    tab: string
  }[]
  activeKey: string
}

export type Emits = {
  ($event: 'update:activeKey', key: string): void
  ($event: 'change', key: string): void
}
