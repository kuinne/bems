export type Props = {
  visible: boolean
  energyType: {
    id: string
    name: string
    code: string
  }
}

export type Emits = {
  ($event: 'close'): void
  ($event: 'submit', data: any): void
}
