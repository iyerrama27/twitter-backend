const cors = require('./cors')
const body_parser = require('./body-parser')

module.exports = (app) => {
  cors(app)
  body_parser(app)
}
