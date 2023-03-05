/**
 * 命令行参数解析工具, 此工具只支持GNU风格
 * @des Unix 风格：参数以「-」（连字符）开头  GNU 风格：参数以「--」（双连字符）开头 BSD 风格：参数以空格分割
 */
const pureArgv = () => {
  let res = {}
  process.argv
    .slice(2)
    .filter((item) => item.indexOf('--') > -1)
    .map((item) => {
      const itemArr = item.split('=')
      const key = itemArr[0].replace('--', '')
      const value = itemArr[1] !== undefined ? itemArr[1] : true
      res[key] = value
      return { [key]: value }
    })

  return res
}

const exit = (msg) => {
  console.error(msg)
  process.exit()
}

const getRepositoryName = (repository) => {
  if (!repository) return
  return repository.split('/').pop()
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

module.exports = { pureArgv, exit, getRepositoryName, execPro }
