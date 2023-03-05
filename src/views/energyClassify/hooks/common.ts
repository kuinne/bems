export const isEmpty = (value: any) => {
  if (value === null || typeof value === 'undefined' || value === '') {
    return true
  } else {
    return false
  }
}
export const emptyToBlank = (value: any) => {
  if (value === null || typeof value === 'undefined' || value === '') {
    return ''
  } else {
    return value
  }
}
