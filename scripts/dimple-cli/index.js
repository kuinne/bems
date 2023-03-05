const path = require('path')
const fs = require('fs-extra')
const { json2type } = require('./modules/json2type')
const { json2snippets } = require('./modules/json2snippets')
const { json2export } = require('./modules/json2export')

/** @type { import('./type').JsonCompileFun } */
const dimpleCli = async (data, options = {}) => {
  const type = options.type

  if (!options.cwd) options.cwd = path.resolve(__dirname, '../../')
  const utilsMap = {
    json2type,
    json2snippets,
    json2export,
  }
  if (!utilsMap[type]) return {}
  try {
    return await utilsMap[type](data, options)
  } catch (error) {
    return error
  }
}

const dimpleCliForExpress = (app, cliOptions = {}) => {
  if (!cliOptions.cwd) cliOptions.cwd = path.resolve(__dirname, '../../')
  app.post('/dimple-cli', async (req, res) => {
    const jsonData = req.body || []
    let result = []
    for (const item of jsonData) {
      const { data = {}, options = {} } = item
      try {
        const res = await dimpleCli(data, options)
        result.push({ success: res.options })
      } catch (error) {
        result.push({ error: { ...options, error } })
      }
    }
    res.send({ result })
  })
}

const res = { dimpleCli, dimpleCliForExpress }

const isAMD = typeof define === 'function' && define.amd
const isCMD = !isAMD && typeof exports === 'object'

if (isAMD) define([], res)
if (isCMD) module.exports = res
