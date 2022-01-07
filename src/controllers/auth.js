const jwt = require('jsonwebtoken')
const UserService = require('../services/User')
const RefreshTokenService = require('../services/RefreshToken')
const { createToken, isValid } = require('../utils/token')
const { comparePassword } = require('../utils/password')

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
