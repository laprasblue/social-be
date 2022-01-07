const express = require('express')
const router = require('./routes/index')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const helmet = require('helmet')

const connectDatabase = require('./utils/connectDatabase')
const { getToken } = require('./middlewares/token')
dotenv.config()
connectDatabase()

const app = express()
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000
app.use(helmet())
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use('/api', router)
app.get('/', getToken, async (req, res) => {
  // eslint-disable-next-line no-undef
  const decode = await jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET)
  res.send(decode)
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
