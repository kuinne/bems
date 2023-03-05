export const isEmpty = (value: any) => {
  if (value === null || typeof value === 'undefined' || value === '') {
    return true
  } else {
    return false
  }
}
// 对象给对象相同属性赋值
export const objAssign = (arrA: any, arrB: any) =>
  Object.keys(arrA).forEach((key) => {
    arrA[key] = arrB[key] || arrA[key]
  })

  export interface anyObjectT {
    [key: string]: any
  }

  // 数组下标交换
  export const swapArray = (arr: any, index1: number, index2: number) => {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0]
    return arr
  }