import { Options } from '../../components/ChargingSetting/constants'
export * from './export'

export const isUndef = (val: any) => val === undefined || val === null
export const removeEmptyKey = (obj: Record<PropertyKey, any>) => {
  for (let key in obj) {
    const item = obj[key]
    if (item === undefined || item === null) {
      delete obj[key]
    } else if (typeof item === 'object') {
      removeEmptyKey(item)
    }
  }
  return obj
}

export const optionsToEnums = (options: Options<any>) => {
  return options.reduce<Record<any, any>>((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value)
}
