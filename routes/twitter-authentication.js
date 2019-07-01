const passport = require('passport')
const express = require('express')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const request = require('request')
// const url = require('url')
const utils = require('../utils/index')
const router = express.Router()

const createToken = function (auth) {
  return jwt.sign({
    id: auth.id
  }, utils.getConfig().appSecret, {
    expiresIn: 60 * 120
  })
}

const generateToken = function (req, res, next) {
  req.token = createToken(req.auth)
  return next()
}

const sendToken = function (req, res) {
  res.setHeader('x-auth-token', req.token)
  return res.status(200).send(JSON.stringify(req.user))
}

//token handling middleware
const authenticate = expressJwt({
  secret: utils.getConfig().appSecret,
  requestProperty: 'auth',
  getToken: function (req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token']
    }
    return null
  }
})

const getCurrentUser = function (req, res, next) {
  const User = utils.getUser()
  User.findById(req.auth.id, function (err, user) {
    if (err) {
      return next(err)
    }
    req.user = user
    return next()
  })
}

const getOne = function (req, res) {
  const user = req.user.toObject()

  delete user['twitterProvider']
  delete user['__v']

  res.json(user)
}

/* 
  router.post('/auth/twitter', (req, res, next) => {
    const config = utils.getConfig()
    const oauth = new OAuth.OAuth(
      // this generally returns user_id
      config.api.twitter.request_token,
      config.api.twitter.access_token,
      config.twitter.consumer_key,
      config.twitter.consumer_secret,
      config.twitter.oauth_version,
      config.api.twitter.callback_url,
      config.twitter.hash_mechanism
    )

    oauth.getOAuthRequestToken((error, oAuthToken, oAuthTokenSecret, results) => {
      // ref. https://github.com/ciaranj/node-oauth/tree/master/examples
      const uri = url.parse(req.url, true)
      const auth_url = `${config.api.twitter.oauth_authenticate}?oauth_token=${oAuthToken}`
      return request(auth_url, (error, response, body) => {
        if (error) {
          return res.send(500, {
            message: error.message
          })
        }

        req.body['oauth_token'] = oAuthToken
        req.body['oauth_token_secret'] = oAuthTokenSecret
        req.body['user_id'] = 
      })
    })
  })
*/

router.post('/auth/twitter/reverse', (req, res) => {
  const config = utils.getConfig()
  request.post({
    url: config.api.twitter.oauth_request_token,
    oauth: {
      oauth_callback: config.api.twitter.callback_url,
      consumer_key: config.twitter.consumer_key,
      consumer_secret: config.twitter.consumer_secret
    }
  }, (err, r, body) => {
    if (err) {
      return res.send(500, {
        message: err.message
      })
    }

    const jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}'
    res.send(JSON.parse(jsonStr))
  })
})

router.post('/auth/twitter', (req, res, next) => {
  const config = utils.getConfig()
  return request.post({
    url: config.api.twitter.oauth_access_token,
    oauth: {
      consumer_key: config.twitter.consumer_key,
      consumer_secret: config.twitter.consumer_secret,
      token: req.query.oauth_token
    },
    form: {
      oauth_verifier: req.query.oauth_verifier
    }
  }, (err, r, body) => {
    if (err) {
      return res.send(500, {
        message: err.message
      })
    }
    const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}'
    const parsedBody = JSON.parse(bodyString)

    req.body['oauth_token'] = parsedBody.oauth_token
    req.body['oauth_token_secret'] = parsedBody.oauth_token_secret
    req.body['user_id'] = parsedBody.user_id

    return next()
  })
}, passport.authenticate('twitter-token', {
  session: false
}), (req, res, next) => {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated')
  }

  // prepare token for API
  req.auth = {
    id: req.user.id
  }

  return next()
}, generateToken, sendToken)

router.route('/auth/me')
  .get(authenticate, getCurrentUser, getOne)

module.exports = router
