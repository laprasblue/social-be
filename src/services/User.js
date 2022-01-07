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

const findAll = async (limit, startIndex, search) => {
  return await User.find({
    $or: [
      { email: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
    ],
  })
    .limit(limit)
    .skip(startIndex)
    .exec()
}
const countDocs = async (search) => {
  return await User.find({
    $or: [
      { email: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
    ],
  })
    .countDocuments()
    .exec()
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
