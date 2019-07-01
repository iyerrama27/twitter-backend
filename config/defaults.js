module.exports = {
  api: {
    twitter: {
      oauth_access_token: 'https://api.twitter.com/oauth/access_token?oauth_verifier',
      oauth_request_token: 'https://api.twitter.com/oauth/request_token',
      oauth_authenticate: 'https://api.twitter.com/oauth/authenticate',
      callback_url: 'http://localhost:8000/twitter-callback'
    }
  },
  db: {
    url: 'mongodb://localhost:27017/twitter-demo',
    options: {
      autoReconnect: true,
      connectTimeoutMS: 15000,
      keepAlive: true,
      noDelay: true,
      reconnectInterval: 1000,
      reconnectTries: 20,
      useNewUrlParser: true,
    }
  }
}
