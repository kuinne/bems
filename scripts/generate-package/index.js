#!/usr/bin/env node

/**
 * 添加新组件
 * 1、在 /packages 目录下新建组件目录，并完成目录结构的创建
 */
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const resolve = (...file) => path.resolve(__dirname, ...file)
const log = (message) => console.log(chalk.green(`${message}`))
const successLog = (message) => console.log(chalk.blue(`${message}`))
const errorLog = (error) => console.log(chalk.red(`${error}`))
// 导入模板
const { demoTemplate, componentTemplate, routerTemplate, entryTemplate, typeTemplate } = require('./utils/template')

// 生成文件
const generateFile = (path, data) => {
  if (fs.existsSync(path)) {
    errorLog(`${path}文件已存在`)
    return
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf8', (err) => {
      if (err) {
        errorLog(err.message)
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}
log('请输入要生成的组件名称,会生成在 /packages 目录下')
let componentName = ''
process.stdin.on('data', async (chunk) => {
  // 模块名称
  const inputName = String(chunk).trim().toString()
  // 模块路径
  const componentPath = resolve('../../src/das-fe/ui/packages', inputName)
  const routerFile = resolve(componentPath, 'router.ts')
  const entryFile = resolve(componentPath, 'index.ts')

  // 判断模块文件夹是否存在
  const hasComponentExists = fs.existsSync(componentPath)
  if (hasComponentExists) {
    errorLog(`${inputName}组件已存在，请重新输入`)
    return
  } else {
    await dotExistDirectoryCreate(componentPath)
  }

  try {
    // 获取模块名
    if (inputName.includes('/')) {
      const inputArr = inputName.split('/')
      componentName = inputArr[inputArr.length - 1]
    } else {
      componentName = inputName
    }

    // 生成src文件夹
    const srcPath = resolve(`../../src/das-fe/ui/packages/${componentName}`, 'src')
    const demoPath = resolve(`../../src/das-fe/ui/packages/${componentName}`, 'demo')
    await dotExistDirectoryCreate(srcPath)
    await dotExistDirectoryCreate(demoPath)

    // 生成所需文件
    const demoFile = resolve(demoPath, 'Index.vue')
    log(`正在生成Demo文件 ${demoFile}`)
    await generateFile(demoFile, demoTemplate(componentName))
    const componentFile = resolve(srcPath, `Index.vue`)
    log(`正在生成组件文件 ${componentFile}`)
    await generateFile(componentFile, componentTemplate(componentName))
    log(`正在生成路由文件 ${routerFile}`)
    await generateFile(routerFile, routerTemplate(componentName))
    log(`正在生成入口文件 ${entryFile}`)
    await generateFile(entryFile, entryTemplate(componentName))
    const typeFile = resolve(srcPath, `type.d.ts`)
    log(`正在生成type.d.ts ${typeFile}`)
    await generateFile(typeFile, typeTemplate())

    successLog('生成成功')
  } catch (e) {
    errorLog(e.message)
  }
  process.stdin.emit('end')
})

process.stdin.on('end', () => {
  log('exit')
  process.exit()
})

function dotExistDirectoryCreate(directory) {
  return new Promise((resolve) => {
    mkdirs(directory, function () {
      resolve(true)
    })
  })
}

// 递归创建目录
function mkdirs(directory, callback) {
  var exists = fs.existsSync(directory)
  if (exists) {
    callback()
  } else {
    mkdirs(path.dirname(directory), function () {
      fs.mkdirSync(directory)
      callback()
    })
  }
}
