## What does this project do?
1. Allows you to authenticate via Twitter
2. Authorizes the app via Twitter oauth tokens
3. Account registration to the app itself. Routes used

## APIs present
|API|Method|Response|Description|
|--|--|--|--|
|`/register`|POST|```{message: string, authtoken: string}```|Registration endpoint. An authtoken is returned, use the authtoken to authenticate requests|
|`/login`|POST|```{message: string, authtoken: string}```|Login endpoint. Allows registered used to login-into the app|
|`/api/v1//auth/twitter/reverse`|POST||Twitter request_token endpoint.|
|`/auth/twitter`|POST||Twitter oauth_verifier to get oauth_token|

## Steps to use
1. Clone app
```sh
git clone https://github.com/iyerrama27/twitter-backend.git
```
2. Change directory into the app and install dependencies
```sh
npm install
```

3. Start the app
```sh
npm start
```

4. Test registration endpoint (ex. postman client)
API endpoint: http://localhost:{port}/register
Method: POST
Body:
{
  username: string,
  password: string,
}
Returns an authtoken, which can be used to authenticate subsequent calls

5. Test login endpoint (ex. postman client)
API endpoint: http://localhost:{port}/login
Method: POST
Body:
{
  username: string,
  password: string,
}
Returns an authtoken, which can be used to authenticate subsequent calls

6. Twitter authentication
API endpoint: http://localhost:{port}/api/v1/auth/twitter/reverse
Method: POST