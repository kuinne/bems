export type Fn<T> = (...args: any[]) => T

export type Options<K, V = string> = Array<{
  value: K
  label: V
  disabled?: boolean
}>
