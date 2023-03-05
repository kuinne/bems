import { ref } from 'vue'
export function useRowEdit<T extends object = any>() {
  const editingRows = ref(new Map<T, boolean>())

  const setEditingRow = (row: T, editable: boolean) => {
    editingRows.value.set(row, editable)
  }

  const clearEditingRows = (rows: T[]) => {
    for (let row of rows) {
      editingRows.value.delete(row)
    }
  }

  const isEditingRow = (row: T) => {
    if (editingRows.value.has(row)) {
      return editingRows.value.get(row)!
    }
    return false
  }

  return {
    setEditingRow,
    clearEditingRows,
    isEditingRow,
  }
}
