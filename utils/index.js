const crypto = require('crypto')
const config = require('./config')
const mongoose = require('./mongoose')
const passport = require('./passport')
const mongoose2 = require('mongoose')

exports.init = () => {
  config.init()
  mongoose()
  // setup configuration for twitter login
  passport()
}

exports.getUser = () => {
  return mongoose2.model('User')
}

exports.getAuth = () => {
  return mongoose2.model('Auth')
}

exports.getAuthToken = () => {
  return mongoose2.model('AuthTokens')
}

exports.setConfig = config.setConfig
exports.getConfig = config.getConfig

exports.generateSalt = () => {
  return crypto
    .randomBytes(15)
    .toString('base64')
    .replace('+', '')
    .replace('/', '')
    .replace('=', '')
    .replace('\n', '')
    .trim()
}

exports.generateAuthtoken = (length) => {
  return 'kbk' + crypto.randomBytes(length).toString('hex')
}

exports.computeHash = (plainText, salt) => {
  let digest = plainText + salt
  let shasum
  for (let i = 0; i < 20; i++) {
    shasum = crypto.createHash('sha512')
    shasum.update(digest)
    digest = shasum.digest("hex")
  }
  return digest
}

exports.compareHash = (plainText, salt, hash) => {
  return this.computeHash(plainText, salt) === hash
}
