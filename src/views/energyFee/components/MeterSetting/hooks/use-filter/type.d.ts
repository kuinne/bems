export type Props = {
  modelValue: {
    meterType: number
    search: string
  }
}

export type Emits = {
  ($event: 'update:modelValue', value: any): void
}
