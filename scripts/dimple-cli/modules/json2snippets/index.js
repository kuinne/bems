const path = require('path')
const fs = require('fs-extra')

const json2snippets = (jsonData, options) => {
  if (!options) options = {}
  if (!options.fileName) options.fileName = `dimple-cli.local.code-snippets`
  if (!options.filePath) options.filePath = path.join(options.cwd, '/.vscode/' + options.fileName)
  const { filePath } = options

  fs.ensureFileSync(filePath)
  fs.writeJSONSync(filePath, jsonData, { spaces: 2 })
  return { data: jsonData, options }
}

exports.json2snippets = json2snippets
