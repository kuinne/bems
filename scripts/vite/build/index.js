const path = require('path')

const { getProjectConfig, pureArgv } = require('../../utils')
const { generateIndex } = require('../../auto-generate-index')

const root = path.resolve(__dirname, '../../../')
const configFile = path.resolve(__dirname, '../../../vite.config.ts')

async function build() {
  const fs = require('fs-extra')
  const { build: viteBuild } = require('vite')
  const { setConfig } = require('../../set-config')
  const { cloneCli } = require('../../clone-cli')
  const { isStarter, isApp } = require('../../async-starter')
  const options = pureArgv()
  const config = getProjectConfig()
  const mainAppName = (options.mainAppName || config.mainAppName || '').toLocaleLowerCase()
  let microApps = config.microApps || []
  if (options.microApps) {
    microApps = options.microApps.split(',').map((item) => ({ name: item.toLocaleLowerCase() }))
    config.microApps = microApps
  }
  // if (mainAppName && !config.publicPath) config.publicPath = `/${mainAppName}/`

  const microAppName = (options.microAppName || config.microAppName || '').toLocaleLowerCase()
  const isMainApp = microApps.length > 0
  const isMicroApp = !!microAppName
  // const urlPrefix = mainAppName ? `/${mainAppName}` : ''
  config.mainAppName = mainAppName

  const nginxMainTempPath = path.resolve(__dirname, './nginx.main.conf')
  const nginxMicroTempPath = path.resolve(__dirname, './nginx.micro.conf')
  const nginxDistPath = path.resolve(__dirname, '../../../dist/nginx.conf')

  let nginxMainText = fs.readFileSync(nginxMainTempPath).toString()
  let nginxMicroText = fs.readFileSync(nginxMicroTempPath).toString()

  if (isMicroApp) {
    config.microAppName = microAppName
    nginxMicroText = nginxMicroText.replace(/\{url\}/g, `/${microAppName}`.replace(/\/\//g, '/'))
  }

  if (isMainApp) {
    let microLocation = ''
    for (const item of microApps) {
      let serverName = item.name
        .split('/')
        .filter((aItem) => aItem !== '/' && !!aItem)
        .join('-')
      if (serverName.indexOf('-') < 0) serverName = `${mainAppName}-${serverName}`
      const suffix = 'html|htm|js|css|txt|gif|jpg|jpeg|bmp|png|ico|svg'
      microLocation += `
        location ~ ^${('/' + item.name + '/').replace(/\/\//g, '/')}.*\\.(${suffix})$ {
            proxy_pass http://${serverName}-web;
        }
        \r\n
        `
    }
    nginxMainText = nginxMainText.replace('{microLocation}', microLocation)
    nginxMainText = nginxMainText.replace('{url}', '/')
  }

  fs.writeFileSync(path.resolve(__dirname, '../../../public/config.js'), `window.config = ${JSON.stringify(config)}`)

  if (isStarter || isApp) await cloneCli(options)
  await setConfig()
  generateIndex()
  await viteBuild({
    root,
    configFile,
  })
  if (isMainApp) fs.writeFileSync(nginxDistPath, nginxMainText)
  if (isMicroApp) fs.writeFileSync(nginxDistPath, nginxMicroText)
}

module.exports = { build }
