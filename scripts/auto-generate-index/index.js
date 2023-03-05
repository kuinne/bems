const path = require('path')
const fs = require('fs-extra')
const glob = require('fast-glob')
const chokidar = require('chokidar')
const { getExportKeysByMatch } = require('../utils/get-export')

const getConfig = (options = {}) => {
  if (!options) options = {}
  if (!options.cwd) options.cwd = path.resolve(__dirname, '../../')
  if (!options.entry) options.entry = 'src/**/auto-index.json'
  const { entry, cwd } = options
  const entryConfigGlob = glob.sync(entry, { cwd })
  let watchGlob = []
  for (const item of entryConfigGlob) {
    const itemConfig = fs.readJSONSync(item)
    if (!itemConfig.entry) continue
    if (Array.isArray(itemConfig.entry)) {
      watchGlob.push(...itemConfig.entry.map((eitem) => `${item.replace('/auto-index.json', '')}/${eitem}`))
    } else watchGlob.push(`${item.replace('/auto-index.json', '')}/${itemConfig.entry}`)
  }

  return { entry, cwd, watchGlob }
}

const generateIndex = (options = {}) => {
  const { entry, cwd } = getConfig(options)
  const entryConfigGlob = glob.sync(entry, { cwd, absolute: true })
  for (const item of entryConfigGlob) {
    let res = []
    const itemConfig = fs.readJSONSync(item)
    if (!itemConfig.entry) continue
    const cwd = path.resolve(item, '../')
    const itemImportEntryGlob = glob.sync(itemConfig.entry, { absolute: true, cwd })
    itemImportEntryGlob.map((item) => {
      getExportKeysByMatch(item)
        .filter((key) => key !== 'default')
        .map((key) => {
          res.push({
            key,
            value: '.' + path.resolve(item).replace(cwd, '').replace(/\\\\/g,'/').replace(/\\/g,'/').replace('/index.ts', ''),
          })
        })
    })
    let exportStr = ''
    for (const item of res) {
      exportStr += `export { ${item.key} } from '${item.value}'; \r\n`
    }
    const autoIndexPath = path.resolve(item, '../index.ts')
    fs.ensureFileSync(autoIndexPath)
    fs.writeFileSync(autoIndexPath, exportStr)
  }
}

const watchGenerateIndex = (options = {}) => {
  const { cwd, watchGlob } = getConfig(options)
  console.log(watchGlob)
  const watcher = chokidar.watch(watchGlob, { persistent: true, cwd })
  watcher.on('change', (path) => {
    console.log('change', path)
    generateIndex(options)
  })
}

const argv = require('minimist')(process.argv.slice(2))
if (argv._.includes('watch')) watchGenerateIndex(argv)

module.exports = { generateIndex, watchGenerateIndex }
