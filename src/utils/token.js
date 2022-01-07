const jwt = require('jsonwebtoken')

module.exports.createToken = async (profile) => {
  return await jwt.sign(
    { email: profile.email, firstName: profile.firstName, lastName: profile.lastName },
    process.env.ACCESS_TOKEN_SECRET || '122@111!!~',
    { expiresIn: profile.exp }
  )
}

module.exports.isValid = async (token) => {
  try {
    await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '122@111!!~')
    return true
  } catch (error) {
    return false
  }
}
