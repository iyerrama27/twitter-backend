'use strict'

const passport = require('passport')
const TwitterTokenStrategy = require('passport-twitter-token')
const utils = require('./index')

module.exports = function () {
  const User = utils.getUser()
  const twitterConfig = utils.getConfig().twitter
  passport.use(new TwitterTokenStrategy({
      consumerKey: twitterConfig.consumer_key,
      consumerSecret: twitterConfig.consumer_secret,
      includeEmail: true
    },
    (token, tokenSecret, profile, done) => {
      User.upsertTwitterUser(token, tokenSecret, profile, done)
    }))
}
