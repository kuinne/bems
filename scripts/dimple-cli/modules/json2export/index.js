const path = require('path')
const fs = require('fs-extra')

const json2export = async (jsonData, options) => {
  if (!options) options = {}
  if (!options.fileName) options.fileName = 'index.local.js'
  if (!options.filePath) options.filePath = path.join(options.cwd || '', options.currentPath + '/' + options.fileName)
  const { filePath } = options

  let data = ''
  for (const item of jsonData) {
    data += `export { ${item.exportKeys.join(',')} } from '${item.importUrl}'; \r\n`
  }
  fs.writeFileSync(filePath, data)

  return { data, options }
}

exports.json2export = json2export
