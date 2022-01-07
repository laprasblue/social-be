const express = require('express')
const googleAuth = require('google-auth-library')
const { login } = require('../controllers/auth')
const authRoute = express.Router()

authRoute.get('/', async (req, res) => {
  try {
    const headers = req.headers
    const client = new googleAuth.OAuth2Client(
      '50194389862-48ijhbjal0giqpc79hgi76btdh463dm0.apps.googleusercontent.com'
    )
    const token = headers['authorization'].split(' ')[1]
    if (!token || token == 'null') return res.sendStatus(401)

    const data = await client.verifyIdToken({
      idToken: token,
      audience: '50194389862-48ijhbjal0giqpc79hgi76btdh463dm0.apps.googleusercontent.com',
    })
    console.log(data)
    return res.sendStatus(200)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

authRoute.post('/login', login)

module.exports = authRoute
