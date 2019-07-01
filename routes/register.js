const express = require('express')
const utils = require('../utils/index')
const validations = require('../utils/validations')
const router = express.Router()

router.post('/', (req, res) => {
  // add password validations
  const body = req.body
  validations.userRegistration(body)
  const salt = utils.generateSalt()
  const hash = utils.computeHash(req.body.password, salt)
  const Auth = utils.getAuth()

  Auth.register(req.body.username, salt, hash, (error) => {
    if (error) {
      // ref. https://www.restapitutorial.com/httpstatuscodes.html
      return res.status(409).json({
        message: 'Username already exists. Please pick a new one!'
      })
    }
    const authtoken = utils.generateAuthtoken(8)
    const AuthTokens = utils.getAuthToken()

    AuthTokens.upsertTokens(req.body.username, [authtoken], (error) => {
      if (error) {
        console.error(error)
        return res.status(500).json({
          message: 'Failed to generate authtoken!'
        })
      }

      return res.json({
        message: 'Account registered successfully!',
        authtoken
      })
    })
  })
})

module.exports = router
