/**
 * 判断字符串是否包含大写字母
 * @param {*} str
 * @returns
 */
const containsUpperCase = (str) => str !== str.toLowerCase()

/**
 * 小驼峰格式转为下划线格式
 * @param {*} name
 * @returns
 */
const underline = (name) => {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase()
}

module.exports = {
  containsUpperCase,
  underline,
}
