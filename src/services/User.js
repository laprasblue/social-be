const User = require('../models/User')

const findByEmail = async (email) => {
  return await User.findOne({ email })
}

const findByPhone = async (phone) => {
  return await User.findOne({ phone })
}

const createUser = async (profile) => {
  return await User.create(profile)
}

const findById = async (id) => {
  return await User.findById(id)
}

const findAll = async (limit, startIndex) => {
  return await User.find().limit(limit).skip(startIndex).exec()
}
const countDocs = async () => {
  return await User.countDocuments().exec()
}
const deleteById = async (id) => {
  return await User.deleteOne({ _id: id })
}

module.exports = {
  findAll,
  findByEmail,
  findById,
  findByPhone,
  createUser,
  createUser,
  countDocs,
  deleteById,
}
