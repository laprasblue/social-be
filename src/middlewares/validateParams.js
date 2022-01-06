const { validationResult } = require('express-validator')

module.exports.validateParams = (req, res, next) => {
  console.log(req.body.email)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    })
  }
  next()
}
