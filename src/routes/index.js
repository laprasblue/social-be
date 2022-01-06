const { Router } = require('express')
const authRoute = require('./auth')
const userRoute = require('./user')
const router = Router()

router.use('/user', userRoute)
router.use('/auth', authRoute)

module.exports = router
