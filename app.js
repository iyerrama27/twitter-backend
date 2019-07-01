const express = require('express')
const utils = require('./utils/index')

const app = express()
const port = process.env.PORT || 8000
utils.init()

require('./routes')(app)

const server = app.listen(port, (error) => {
  if (error) {
    console.error(error)
    process.exit(1)
  }

  console.log(`App started successfully @${port}!`)
})

module.exports = app
