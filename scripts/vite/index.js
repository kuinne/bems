const { dev } = require('./dev')
const { build } = require('./build')
const { buildForMainApp } = require('../build')

const isBuild = process.argv.includes('--build') 
const isDev = !isBuild
const isBuildMainApp = isBuild && process.argv.includes('--main-app')

if (isDev) dev()
if (isBuild && !isBuildMainApp) build()
if (isBuildMainApp) buildForMainApp()
