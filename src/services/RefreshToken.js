const RefreshToken = require('../models/RefreshToken')

const createRefreshToken = async (profile) => {
  return await RefreshToken.create(profile)
}
const findByUserId = async (id) => {
  return await RefreshToken.findOne({ userId: id })
}

const UpdateByUserId = async (id, refreshToken) => {
  return await RefreshToken.findOneAndUpdate({ userId: id }, { refreshToken })
}

module.exports = {
  createRefreshToken,
  findByUserId,
  UpdateByUserId,
}
