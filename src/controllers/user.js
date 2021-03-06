const UserService = require('../services/User')
const RefreshTokenService = require('../services/RefreshToken')
const { hashPassword } = require('../utils/password')

module.exports.createUser = async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body

  try {
    const hashPass = await hashPassword(password)
    const user = await UserService.createUser({
      email,
      password: hashPass,
      firstName,
      lastName,
      phone,
    })
    await RefreshTokenService.createRefreshToken({
      userId: user.id,
      refreshToken: req.refreshToken,
    })
    res.status(201).json({
      msg: 'Created User',
      token: req.token,
      refreshToken: req.refreshToken,
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

module.exports.getOneUser = async (req, res) => {
  try {
    let user = await UserService.findById(req.params.id)

    if (user) {
      user.password = '***'
      return res.status(200).json({
        msg: 'Having a user',
        data: user,
      })
    } else {
      return res.sendStatus(400)
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      msg: 'No item!',
    })
  }
}

module.exports.deleteUser = async (req, res) => {
  try {
    const result = await UserService.deleteById(req.body.id)

    if (result.deletedCount == 0) {
      return res.status(400).json({
        msg: 'No ID is matching!!!',
      })
    }

    res.status(200).json({
      msg: `This user is deleted!`,
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

module.exports.getAllUser = async (req, res) => {
  try {
    const users = res.paginatedResults

    if (users) {
      const results = users.results.map(
        ({ email, _id, firstName, lastName, phone, isActive, createdAt, updatedAt }) => {
          return {
            email,
            _id,
            firstName,
            lastName,
            phone,
            isActive,
            createdAt,
            updatedAt,
          }
        }
      )
      return res.status(200).json({
        msg: 'Got it!',
        data: {
          ...users,
          results: results,
        },
      })
    } else {
      return res.sendStatus(400)
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      msg: 'No item!',
    })
  }
}
