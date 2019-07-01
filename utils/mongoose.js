'use strict'

const mongoose = require('mongoose')
const utils = require('./index')
const Schema = mongoose.Schema

module.exports = function () {
  const config = utils.getConfig()
  const db = mongoose.connect(config.db.url, config.db.options)

  const UserSchema = new Schema({
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      // need to update regex to include '.' and '+'
      // need to eval: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    twitterProvider: {
      type: {
        id: String,
        token: String
      },
      select: false
    }
  })

  UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
  })

  UserSchema.statics.upsertTwitterUser = function (token, tokenSecret, profile, cb) {
    return this.findOne({
      'twitterProvider.id': profile.id
    }, (err, user) => {
      // if no user is found, create a new one
      if (!user) {
        const twitterUserDetails = new this({
          email: profile.emails[0].value,
          twitterProvider: {
            id: profile.id,
            token: token,
            tokenSecret: tokenSecret
          }
        })

        return twitterUserDetails.save(cb)
      }
      return cb(err, user)
    })
  }

  const AuthSchema = new Schema({
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      // can be an email as well
      // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    hash: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      required: true,
      unique: true,
    }
  })

  AuthSchema.set('toJSON', {
    getters: true,
    virtuals: true
  })

  const AuthTokenSchema = new Schema({
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      // can be an email as well
      // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    authtokens: {
      type: [String],
      required: true,
      unique: true,
    }
  })

  AuthTokenSchema.set('toJSON', {
    getters: true,
    virtuals: true
  })

  AuthSchema.statics.register = function (username, salt, hash, cb) {
    return this.findOne({
      username: username
    }, (error, user) => {
      if (error) {
        return cb(error, null)
      } else if (user) {
        return cb('Username already exists! Please choose a new one')
      }

      const newUser = new this({
        username,
        salt,
        hash: hash,
      })

      return newUser.save(cb)
    })
  }

  AuthSchema.statics.getSaltNHash = function (username, cb) {
    return this.findOne({
      username,
    }, (error, user) => {
      if (error) {
        return cb(error, null)
      } else if (!user) {
        console.log('user did not exist!')
        return cb('Invalid credentials!')
      }

      return cb(null, {
        salt: user.salt,
        hash: user.hash
      })
    })
  }

  AuthTokenSchema.statics.getTokens = function (username, cb) {
    return this.findOne({
      username,
    }, (error, details) => {
      if (error) {
        return cb(error)
      }

      return cb(null, details)
    })
  }

  AuthTokenSchema.statics.upsertTokens = function (username, authtokens, cb) {
    return this.updateOne({
      username
    }, {
      username,
      authtokens
    }, {
      upsert: true
    }, (error, status) => {
      if (error) {
        return cb('Errorred while updating authtokens')
      }

      return cb(null, null)
    })
  }

  mongoose.model('User', UserSchema)
  mongoose.model('Auth', AuthSchema)
  mongoose.model('AuthTokens', AuthTokenSchema)

  return db
}
