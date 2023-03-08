import type { Fn, Options } from '../type'
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

export function pendingDecorator<T extends Fn<Promise<boolean>>>(fn: T) {
  return async (...args: Parameters<T>): Promise<boolean> => {
    return new Promise(async (resolve) => {
      try {
        const shouldResolved = await fn(...args)
        resolve(shouldResolved)
      } catch (error) {
        return false
      }
    })
  }
}
