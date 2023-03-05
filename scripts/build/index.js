const path = require('path')
const { execSync } = require('child_process')

try {
  const fs = require('fs-extra')
} catch (error) {
  execSync('pnpm i', { stdio: 'inherit' })
}
const fs = require('fs-extra')
const { pureArgv, exit, execPro } = require('./utils')

const buildForMainApp = async () => {
  const optiions = pureArgv()
  console.log(optiions)
  const {
    mainAppRepository = '-b dev http://das-git.chn-das.com/DasAIoT/SuperAdmin/Front-end/SuperAdmin',
    microAppRepository = '-b dev http://das-git.chn-das.com/DasAIoT/SuperAdmin/Front-end/resources,-b dev http://das-git.chn-das.com/DasAIoT/SuperAdmin/Front-end/permissions',
  } = optiions
  if (!mainAppRepository) exit('主应用仓库地址必填！')
  if (!microAppRepository) exit('子应用仓库地址必填！')
  const distDir = path.resolve(__dirname, '../../dist')
  fs.ensureDirSync(distDir)
  fs.emptyDirSync(distDir)

  // clone所有仓库
  let repositoryList = [mainAppRepository, ...microAppRepository.split(',')]
  const repositoryPromiseList = []
  repositoryList = repositoryList.map((item, index) => {
    const repositoryName = item.split('/').pop()
    const repositoryDir = path.join(distDir, repositoryName)
    fs.ensureDirSync(repositoryDir)
    fs.emptyDirSync(repositoryDir)
    repositoryPromiseList.push(execPro(`git clone ${item} --depth=1 ${repositoryDir}`))
    return { name: repositoryName, repositoryName, repositoryDir, isMainApp: index === 0, isMicroApp: index > 0 }
  })
  await Promise.all(repositoryPromiseList)

  // 生成主应用的config文件
  for (const item of repositoryList) {
    if (item.isMicroApp) continue
    const configPath = path.join(item.repositoryDir, 'public/config.js')
    const tempConfig = `${+new Date()}.config.js`
    const configTempPath = path.join(item.repositoryDir, `public/${tempConfig}`)
    const configText = fs.readFileSync(configPath).toString().replace('window.config', 'module.exports')
    fs.writeFileSync(configTempPath, configText)
    const configData = require(configTempPath)
    configData.microApps = repositoryList.filter((item) => item.isMicroApp).map((item) => ({ name: item.name }))
    fs.writeFileSync(configPath, `window.config = ${JSON.stringify(configData)}`)
  }

  // 所有仓库执行打包操作
  const buildPromiseList = []
  repositoryList.map((item) => {
    buildPromiseList.push(execPro('pnpm i && pnpm run async:starter && pnpm i && pnpm run build', { cwd: item.repositoryDir }))
  })
  await Promise.all(buildPromiseList)

  // 把所有仓库打包完成的dist复制到result文件夹
  const resultDir = path.join(distDir, 'result')
  fs.ensureDirSync(resultDir)
  fs.emptyDirSync(resultDir)
  repositoryList = repositoryList.map((item, index) => {
    const fromDir = path.join(item.repositoryDir, 'dist')
    const typeDir = item.isMainApp ? 'main-app' : 'micro-app'
    const toDir = path.join(resultDir, typeDir, item.repositoryName)
    fs.ensureDirSync(toDir)
    fs.emptyDirSync(toDir)
    fs.copySync(fromDir, toDir)

    item.distDir = toDir
    return item
  })

  console.log(repositoryList)
}

module.exports = { buildForMainApp }
