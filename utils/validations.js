exports.userRegistration = (body) => {
  if (typeof body !== 'object' || !body || body instanceof Array) {
    throw new Error('Invalid inputs for user registration!')
  } else if (!body.hasOwnProperty('username') || body.username.length < 2 || body.username.length > 15) {
    throw new Error('Kindly keep username length between 2 and 15')
  } else if (!body.hasOwnProperty('password') || body.password.length < 7 || body.password.length >
    20) { // This needs to be improved
    throw new Error('Kindly keep password length between 7 and 20')
  }
}
