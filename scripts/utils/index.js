const path = require('path')

/**
 * 命令行参数解析工具
 * @des Unix 风格：参数以「-」（连字符）开头  GNU 风格：参数以「--」（双连字符）开头 BSD 风格：参数以空格分割
 */
const pureArgv = () => require('minimist')(process.argv.slice(2))

const exit = (msg) => {
  console.error(msg)
  process.exit()
}

const execPro = (cmd, options = {}) => {
  const { exec } = require('child_process')

  return new Promise((res) => {
    const process = exec(cmd, options)
    process.stdout.on('data', (data) => {
      console.log(data + '')
    })
    process.stderr.on('data', (data) => {
      console.log(data + '')
    })
    process.on('exit', () => {
      res(true)
    })
  })
}

/**
 * 获取项目内的配置信息
 * @param { 'dev'|'prod' } mode
 */
const getProjectConfig = (mode) => {
  const fs = require('fs-extra')
  let configPath = path.resolve(__dirname, '../../public/config.js')
  const tempConfig = `${+new Date()}.config.js`
  const configTempPath = path.resolve(__dirname, `./${tempConfig}`)
  const configText = fs.readFileSync(configPath).toString().replace('window.config', 'module.exports')
  fs.writeFileSync(configTempPath, configText)
  const configData = require(configTempPath)
  fs.removeSync(configTempPath)
  return configData
}

let tsProject
const getTsFileExportList = (filePath) => {
  const fs = require('fs')
  const ts = require('typescript')
  const { Project } = require('ts-morph')

  // 创建一个项目实例，用来存储解析的代码
  if (!tsProject) {
    tsProject = new Project({ skipFileDependencyResolution: true, compilerOptions: { target: ts.ScriptTarget.ESNext } })
    // tsProject.createSourceFile()
  }

  // 加载要解析的TypeScript文件
  const sourceFile = tsProject.createSourceFile('temp.ts', fs.readFileSync(filePath).toString(), { overwrite: true })

  // 获取所有的导出声明
  const exports = sourceFile.getExportedDeclarations()
  return [...exports.keys()].filter((key) => key !== 'default')
}

module.exports = { pureArgv, exit, execPro, getProjectConfig, getTsFileExportList }
