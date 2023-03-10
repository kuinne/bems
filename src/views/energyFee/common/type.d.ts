export type Fn<T, P = any[]> = (...args: P) => T

export type Options<K, V = string> = Array<{
  value: K
  label: V
  disabled?: boolean
}>
