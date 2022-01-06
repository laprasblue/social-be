const { Schema, model } = require('mongoose')
const required = true
const userSchema = new Schema(
  {
    email: { required, type: String },
    password: { type: String },
    firstName: { required, type: String },
    lastName: { required, type: String },
    phone: { required, type: String },
    isActive: { required, type: Boolean, default: false },
  },
  { timestamps: true }
)

const User = model('Users', userSchema, 'Users')
module.exports = User
