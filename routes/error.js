module.exports = (app) => {
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    return next(err)
  })

  // development error handler
  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      console.error('dev error')
      console.error(err)
      res.status(500).send(err)
    })
  }

  // production error handler
  // error won't be propagated to the page
  if (app.get('env') === 'production') {
    app.use((err, req, res, next) => {
      res.status(500).send(err)
    })
  }
}
