export type Props = {
  options: {
    key: string
    tab: string
    render: () => JSX.Element
  }[]
  activeKey: string
}

export type Emits = {
  ($event: 'update:activeKey', key: string): void
}
