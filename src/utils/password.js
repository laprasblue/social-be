const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10)
  return hash
}

const comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword)
}

module.exports = {
  hashPassword,
  comparePassword,
}
