const fs = require('fs')
const _ = require('lodash')
const path = require('path')

let config = {}

exports.init = () => {
  const env = process.env.NODE_ENV || 'development'
  const configPath = path.join(__dirname, '..', 'config', env + '.js')
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file: ${configPath} was not found!`)
  }

  this.setConfig(require(configPath))
}

exports.setConfig = (envConfig) => {
  const defaultConfig = require(path.join(__dirname, '..', 'config', 'defaults.js'))
  // set other config here..
  config = _.merge(defaultConfig, config, envConfig)
}

exports.getConfig = () => {
  return config
}
