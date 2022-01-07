const jwt = require('jsonwebtoken')

const decodeToken = (req, res, next) => {
  // const token
}

const getToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || ''
  const token = authHeader && authHeader.split(' ')[1]
  if (token === null || token === '') return res.sendStatus(401)
  req.token = token
  next()
}

const createToken = async (req, res, next) => {
  try {
    const { email, firstName, lastName } = req.body
    const token = await jwt.sign(
      { email, firstName, lastName },
      process.env.ACCESS_TOKEN_SECRET || '122@111!!~',
      { expiresIn: '1h' }
    )
    req.token = token
    next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const createRefreshToken = async (req, res, next) => {
  try {
    const { email, firstName, lastName } = req.body
    const refreshToken = await jwt.sign(
      { email, firstName, lastName },
      process.env.ACCESS_TOKEN_SECRET || '122@111!!~',
      { expiresIn: '7d' }
    )
    req.refreshToken = refreshToken
    next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

module.exports = {
  decodeToken,
  getToken,
  createToken,
  createRefreshToken,
}
