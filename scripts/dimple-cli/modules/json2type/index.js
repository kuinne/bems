const fs = require('fs-extra')
const path = require('path')
const jsonSchema2type = require('json-schema-to-typescript')

const json2type = async (jsonData, options) => {
  if (!options) options = {}
  if (!options.fileName) options.fileName = 'type.local.d.ts'
  if (!options.filePath) options.filePath = path.join(options.cwd || '', options.currentPath + '/' + options.fileName)
  const { filePath } = options
  const data = await jsonSchema2type.compile(jsonData)
  fs.writeFileSync(filePath, data)

  return { data, options }
}

exports.json2type = json2type
