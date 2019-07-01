const express = require('express')
const utils = require('../utils/index')
const validations = require('../utils/validations')
const router = express.Router()

router.post('/', (req, res) => {
  // add password validations
  validations.userRegistration(req.body)
  const Auth = utils.getAuth()

  Auth.getSaltNHash(req.body.username, (error, saltNHash) => {
    if (error) {
      // its a better standard to keep generic errors for invalid username + password
      return res.status(401).json(error)
    }

    const salt = saltNHash.salt
    const hash = saltNHash.hash
    const login = utils.compareHash(req.body.password, salt, hash)

    if (!login) {
      // maintain counter. if exceeded, lock out the account
      return res.status(401).json({
        message: 'Invalid credentials!'
      })
    }

    const AuthTokens = utils.getAuthToken()
    AuthTokens.getTokens(req.body.username, (error, details) => {
      if (error) {
        // its a better standard to keep generic errors for invalid username + password
        res.status(500).json({
          message: 'Server failed to retrieve authtokens for this account!'
        })
      }
      const authtokens = details.authtokens
      const authtoken = utils.generateAuthtoken(8)
      // hold only 20 tokenx max and move teh last token out
      if (authtokens.length >= 20) {
        authtokens.shift()
      }

      authtokens.push(authtoken)

      AuthTokens.upsertTokens(req.body.username, authtokens, (error) => {
        if (error) {
          // its a better standard to keep generic errors for invalid username + password
          return res.status(500).json({
            message: 'Server error while saving authtokens!'
          })
        }

        return res.json({
          username: req.body.username,
          authtoken
        })
      })
    })
  })
})

module.exports = router
