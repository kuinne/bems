export const exportExcel = (file: Blob, filename: any) => {
  const blob = new Blob([file], {
    type: 'application/vnd.ms-excel',
  })
  const objectUrl = URL.createObjectURL(blob)
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    const element = document.createElement('a')
    element.href = objectUrl
    element.download = filename
    element.click()
    window.URL.revokeObjectURL(objectUrl)
  }
}
