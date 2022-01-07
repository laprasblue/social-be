const { Schema, model } = require('mongoose')
const required = true
const refreshTokenSchema = new Schema({
  userId: { required, type: String },
  refreshToken: { required, type: String },
})

const RefreshToken = model('RefreshTokens', refreshTokenSchema, 'RefreshTokens')
module.exports = RefreshToken
