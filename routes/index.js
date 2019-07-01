module.exports = (app) => {
  // load middlwares
  require('../middlewares')(app)
  app.use('/api/v1', require('./twitter-authentication'))
  app.use('/app-status', require('./status'))
  app.use('/login', require('./login'))
  app.use('/register', require('./register'))

  require('./error')(app)
}
