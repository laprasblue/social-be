const mongoose = require('mongoose')

const optionMongoose = { useNewUrlParser: true, useUnifiedTopology: true }
const connectDatabase = () => {
  const urlMongoData = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  console.log(`Connecting to database...`)
  mongoose
    .connect(urlMongoData, optionMongoose)
    .then(() => {
      console.log('Successfully connected to the database')
    })
    .catch((err) => {
      console.log(`Could not connect to the database. Exiting now...\n ${err}`)
      process.exit()
    })
}

module.exports = connectDatabase
