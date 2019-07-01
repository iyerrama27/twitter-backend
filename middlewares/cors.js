const cors = require('cors')

module.exports = (app) => {
  // enable cors
  const corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
  }

  app.use(cors(corsOption))
}
