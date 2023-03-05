async function dev() {
  const express = require('express')
  const { createServer } = require('vite')
  const { setConfig } = require('../../set-config')
  const { cloneCli } = require('../../clone-cli')
  const { dimpleCliForExpress } = require('../../dimple-cli')
  const { isStarter, asyncStarter, isSimpleApp } = require('../../async-starter')
  const { pureArgv } = require('../../utils')
  if (!isStarter) await asyncStarter(pureArgv())
  if (!isSimpleApp) await cloneCli(pureArgv())
  await setConfig()
  const app = express()
  app.use(express.json())
  dimpleCliForExpress(app)
  const vite = await createServer({ server: { middlewareMode: true } })
  app.use(vite.middlewares)
  const { port, host } = vite.config.server
  const serverAddress = `http://${host}:${port}`
  await new Promise((res) => {
    app.listen(port, () => {
      console.log('das-fe前端应用运行于：' + serverAddress)
      res(true)
    })
  })

  return { vite, serverAddress }
}

module.exports = { dev }
