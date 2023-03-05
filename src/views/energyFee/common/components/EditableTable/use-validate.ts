import { ref, Ref } from 'vue'
export function useValidate<T extends object = any>({ tableData, tableColumns, setEditingRow }: { tableData: Ref<any[]>; tableColumns: any[]; setEditingRow: (row: T, editable: boolean) => void }) {
  const errors = ref(new Map<T, Record<string, { error: boolean; errorLabel: string }>>())

  const setError = (row: T, prop: string, error: { error: boolean; errorLabel: string }) => {
    if (errors.value.has(row)) {
      errors.value.get(row)![prop] = error
    } else {
      errors.value.set(row, {
        [prop]: error,
      })
    }
  }

  const getError = (row: T, prop: string) => {
    if (errors.value.has(row)) {
      return errors.value.get(row)![prop]?.error
    }
    return false
  }

  const getErrorLabel = (row: T, prop: string) => {
    if (errors.value.has(row)) {
      return errors.value.get(row)![prop]?.errorLabel
    }
    return ''
  }

  const clearError = (row: T, prop: string) => {
    if (errors.value.has(row)) {
      const target = errors.value.get(row)
      delete target![prop]
    }
  }

  const clearErrors = (rows: T[]) => {
    for (let row of rows) {
      errors.value.delete(row)
    }
  }

  const validate = () => {
    let flag = true
    for (let row of tableData.value) {
      for (let [prop, value] of Object.entries(row)) {
        const validator = tableColumns.find((item: any) => item.prop === prop)?.validator
        if (validator) {
          const errorLabel = validator(value)
          if (errorLabel) {
            flag = false
            setError(row, prop, {
              error: true,
              errorLabel,
            })
            setEditingRow(row, true)
          }
        }
      }
    }
    return flag
  }

  return {
    validate,
    getError,
    setError,
    getErrorLabel,
    clearError,
    clearErrors,
  }
}
