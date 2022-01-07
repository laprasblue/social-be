const UserService = require('../services/User')
const RefreshTokenService = require('../services/RefreshToken')
const { createToken, isValid } = require('../utils/token')
const { comparePassword } = require('../utils/password')
const googleAuth = require('google-auth-library')

module.exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await UserService.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        msg: 'email or password is invalid',
      })
    }

    //validate password
    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        msg: 'email or password is invalid',
      })
    }

    //create token
    const profileToken = { email: user.email, firstName: user.firstName, lastName: user.lastName }
    const token = await createToken({ ...profileToken, exp: '1h' })

    const refreshToken = await RefreshTokenService.findByUserId(user.id)
    if (!refreshToken) {
      const newRefreshToken = await createToken({ ...profileToken, exp: '7d' })
      await RefreshTokenService.createRefreshToken({
        userId: user.id,
        refreshToken: newRefreshToken,
      })
      return res.status(200).json({
        msg: 'Login successfully!!!',
        token: token,
        refreshToken: newRefreshToken,
      })
    }

    // check refresh token valid
    if (!(await isValid(refreshToken.refreshToken))) {
      const newRefreshToken = await createToken({ ...profileToken, exp: '7d' })
      await RefreshTokenService.UpdateByUserId(user.id, newRefreshToken)
      return res.status(200).json({
        msg: 'Login successfully!!!',
        token: token,
        refreshToken: newRefreshToken,
      })
    }

    return res.status(200).json({
      msg: 'Login successfully!!!',
      token: token,
      refreshToken: refreshToken.refreshToken,
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

module.exports.googleLogin = async (req, res) => {
  try {
    const headers = req.headers
    // eslint-disable-next-line no-undef
    const client = new googleAuth.OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const token = headers['authorization'].split(' ')[1]
    if (!token || token == 'null') return res.sendStatus(401)

    const verifyResult = await client.verifyIdToken({
      idToken: token,
      audience: '50194389862-48ijhbjal0giqpc79hgi76btdh463dm0.apps.googleusercontent.com',
    })

    const { email, given_name, family_name } = verifyResult.getPayload()

    let user = await UserService.findByEmail(email)
    if (!user) {
      user = await UserService.createUser({
        email,
        lastName: family_name,
        firstName: given_name,
        phone: '0000',
      })
    }

    const profileToken = { email: email, firstName: given_name, lastName: family_name }
    const newToken = await createToken({ ...profileToken, exp: '1h' })

    const refreshToken = await RefreshTokenService.findByUserId(user.id)

    if (!refreshToken) {
      const newRefreshToken = await createToken({ ...profileToken, exp: '7d' })
      await RefreshTokenService.createRefreshToken({
        userId: user.id,
        refreshToken: newRefreshToken,
      })
      return res.status(200).json({
        msg: 'Login successfully!!!',
        token: newToken,
        refreshToken: newRefreshToken,
      })
    }

    // check refresh token valid
    if (!(await isValid(refreshToken.refreshToken))) {
      const newRefreshToken = await createToken({ ...profileToken, exp: '7d' })
      await RefreshTokenService.UpdateByUserId(user.id, newRefreshToken)
      return res.status(200).json({
        msg: 'Login successfully!!!',
        token: newToken,
        refreshToken: newRefreshToken,
      })
    }

    return res.status(200).json({
      msg: 'Login successfully!!!',
      token: newToken,
      refreshToken: refreshToken.refreshToken,
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}
