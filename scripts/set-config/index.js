const path = require('path')
const fs = require('fs-extra')
const resolve = (src) => path.resolve(__dirname, src)

const templateConfigPath = resolve('./config-template.js')
const configPath = resolve('../../public/config.js')
const localConfigPath = resolve('../../public/config.local.js')

const setConfig = async () => {
  if (!fs.existsSync(configPath)) {
    fs.ensureFileSync(configPath)
    fs.copySync(templateConfigPath, configPath, { overwrite: true })
  }
  if (!fs.existsSync(localConfigPath)) fs.copySync(configPath, localConfigPath)
  const configText = fs.readFileSync(configPath).toString().replace('window.config', 'export const config')
  const localConfigText = fs.readFileSync(localConfigPath).toString().replace('window.config', 'export const config')
  const tempConfigPath = resolve('../../node_modules/temp/config.ts')
  const tempLocalConfigPath = resolve('../../node_modules/temp/config.local.ts')
  fs.ensureFileSync(tempConfigPath)
  fs.ensureFileSync(tempLocalConfigPath)
  fs.writeFileSync(tempConfigPath, configText)
  fs.writeFileSync(tempLocalConfigPath, localConfigText)
}

module.exports = { setConfig }
