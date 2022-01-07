const express = require('express')
const router = require('./routes/index')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const helmet = require('helmet')

const connectDatabase = require('./utils/connectDatabase')
const { getToken } = require('./middlewares/token')
const { isTokenValid } = require('./utils/token')
dotenv.config()
connectDatabase()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use('/api', router)
app.get('/', (req, res) => {
  const { email } = req.body
  console.log(email)
  return res.sendStatus(200)
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
