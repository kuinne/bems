const path = require('path')
const fs = require('fs-extra')
const glob = require('fast-glob')
const { execSync } = require('child_process')
const { pureArgv } = require('../utils')

const cloneCli = async (options) => {
  const modules = await glob('modules/*.js', { cwd: __dirname })
  for (const item of modules) {
    const module = require(path.join(__dirname, item))
    const { baseURL, filePath, fileName, needDir, ignoreFile, ignore } = module
    const branch = options.branch || 'dev'
    if (!ignore) {
      const sourcePath = path.resolve(__dirname, `../../node_modules/temp/das-fe`)

      if (!fs.existsSync(path.join(sourcePath, fileName))) {
        fs.ensureDirSync(path.join(sourcePath, fileName))
        console.log(`git clone das-ui ${branch}`)
        execSync(`git clone -b ${branch} ${baseURL} ${fileName}`, { cwd: sourcePath, stdio: 'inherit' })
      } else {
        console.log(`git pull das-ui ${branch}`)
        execSync(`git pull origin ${branch}`, { cwd: path.join(sourcePath, fileName) })
      }

      const targetPath = path.join(__dirname, filePath, fileName)
      fs.ensureDirSync(targetPath)
      fs.emptyDirSync(targetPath)
      fs.removeSync(targetPath)

      if (needDir && needDir.length) {
        needDir.map((item) => {
          const fromPath = path.join(sourcePath, fileName, item)
          fs.copySync(fromPath, targetPath)
        })
      } else {
        const fromPath = path.join(sourcePath, fileName)
        fs.copySync(fromPath, targetPath)
      }

      if (ignoreFile && ignoreFile.length) {
        const ignoreFiles = await glob([...ignoreFile], { cwd: targetPath })
        for (const file in ignoreFiles) {
          fs.removeSync(path.join(targetPath, ignoreFiles[file]))
        }
      }
    }
  }
  console.log('success done')
}

if (process.argv.includes('--auto')) cloneCli(pureArgv())

module.exports = { cloneCli }
