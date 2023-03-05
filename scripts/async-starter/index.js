const path = require('path')
const fs = require('fs-extra')
const glob = require('fast-glob')
const jsonMerger = require('json-merger')
const { exec, execSync } = require('child_process')
const { pureArgv } = require('../utils')

const { starterGitUrl, rootGlob, srcGlob, ignore, gitignoreList } = require('./config')
const formPath = path.resolve(__dirname, '../../node_modules/temp/async-starter/source/from')
const toPath = path.resolve(__dirname, '../../')
// const toPath = path.resolve(__dirname, '../../node_modules/temp/async-starter/source/to')
let fromPackageJsonPath = path.resolve(formPath, 'package.json')
let fromPackageJson = fs.existsSync(fromPackageJsonPath) ? fs.readJSONSync(fromPackageJsonPath) : {}

const toPackageJsonPath = path.resolve(toPath, 'package.json')

if (!toPackageJsonPath) {
  console.error('请先拷贝stater的package.json进行初始化')
  process.exit()
}
const toPackageJson = fs.readJSONSync(toPackageJsonPath)

const { isApp = false, isStarter = false } = toPackageJson
const isSimpleApp = !(isApp || isStarter)

const asyncStarter = async (options = { branch: 'dev' }) => {
  if (isStarter) return // 如果当前是stater那不需要进行同步
  if (!options) options = {}
  fs.ensureDirSync(formPath)
  fs.emptydirSync(formPath)
  const branch = options.branch || 'dev'
  execSync(`git clone ${starterGitUrl} -b ${branch} --depth=1 ${formPath}`, { stdio: 'inherit' })
  fromPackageJson = fs.readJSONSync(fromPackageJsonPath)

  const rootData = await glob([...rootGlob, '!package.json', '!pnpm-lock.yaml'], { cwd: formPath, dot: true, onlyFiles: false, objectMode: true })
  const srcData = await glob(srcGlob, { cwd: formPath, dot: true, onlyFiles: false, objectMode: true })
  const asyncData = [...rootData, ...srcData]
  asyncData.map((item) => {
    const from = path.resolve(formPath, item.path)
    const to = path.resolve(toPath, item.path)

    let needCopy = true
    // 首次检查ignore时，如果不存在则不忽略
    if (ignore.find((ignoreItem) => to.replace(/\\/g, '/').indexOf(ignoreItem) > -1) && fs.existsSync(to)) {
      needCopy = false
    }
    if (!needCopy) return

    if (fs.statSync(from).isDirectory()) fs.ensureDirSync(to)
    if (fs.statSync(from).isFile()) fs.ensureFileSync(to)
    if (fs.statSync(to).isDirectory()) fs.emptyDirSync(to)
    fs.copySync(from, to, { overwrite: true })
  })

  if (!toPackageJson.scripts) toPackageJson.scripts = {}
  toPackageJson.scripts.dev = fromPackageJson.scripts.dev
  toPackageJson.scripts.build = fromPackageJson.scripts.build
  const newPackageJson = jsonMerger.mergeObjects([fromPackageJson, toPackageJson], { defaultArrayMergeOperation: 'concat' })
  fs.writeFileSync(toPackageJsonPath, JSON.stringify(newPackageJson, '', '\t'), 'utf-8')

  // 把要覆盖的文件忽略，防止提交
  const toGitignorePath = path.resolve(toPath, '.gitignore')
  let gitignore = ''
  if (!fs.existsSync(toGitignorePath)) {
    gitignore = fs.readFileSync(path.resolve(formPath, '.gitignore')).toString()
  } else {
    gitignore = fs.readFileSync(toGitignorePath).toString()
  }
  let staterIgnoreStr = ''
  gitignoreList.forEach((item) => {
    if (gitignore.indexOf(item) < 0) staterIgnoreStr += `${item}\r\n`
  })
  fs.writeFileSync(toGitignorePath, staterIgnoreStr + gitignore)
}

module.exports = { asyncStarter, isStarter, isApp, isSimpleApp }
if (process.argv.includes('--auto')) asyncStarter(pureArgv())
