const { createUser, getOneUser, getAllUser, deleteUser } = require('../controllers/user')
const express = require('express')
const userRoute = express.Router()
const { body } = require('express-validator')
const { validateParams } = require('../middlewares/validateParams')
const UserService = require('../services/User')
const paginate = require('../middlewares/paginate')

userRoute.post(
  '/',
  body('email')
    .isEmail()
    .withMessage('Must be a valid e-mail express')
    .custom(async (email) => {
      const user = await UserService.findByEmail(email)
      if (user) {
        throw new Error('This email is used!!!')
      }
    }),
  body('password')
    .isStrongPassword({ minLength: 8 })
    .withMessage(
      'Password must have at least 8 characters. Having 1 special character, 1 uppercase character (A-Z) and 1 digit (0-9)'
    ),
  body('firstName')
    .notEmpty()
    .withMessage('firstName cannot be null')
    .isLength({ min: 4, max: 32 })
    .withMessage('firstName must have min 4 and max 32 characters'),
  body('lastName')
    .notEmpty()
    .withMessage('lastName cannot be null')
    .isLength({ min: 4, max: 32 })
    .withMessage('lastName must have min 4 and max 32 characters'),
  body('phone')
    .isMobilePhone('vi-VN')
    .withMessage('Must be a valid phone number')
    .custom(async (phone) => {
      const user = await UserService.findByPhone(phone)
      if (user) {
        throw new Error('This phone is used!!!')
      }
    }),
  body('isActive').isBoolean().withMessage('Must be a boolean value'),
  validateParams,
  createUser
)
userRoute.get('/:id', getOneUser)
userRoute.get('/', paginate(UserService), getAllUser)
userRoute.delete(
  '/',
  body('id').notEmpty().withMessage('firstName cannot be null'),
  validateParams,
  deleteUser
)

module.exports = userRoute
