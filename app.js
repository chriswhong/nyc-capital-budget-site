const express = require('express')
const logger = require('morgan')
const path = require('path')
const mongoose = require('mongoose')

const routes = require('./routes.jsx')

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

const app = express()

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine())

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)

// error handling middleware
// routes should call next(error) in the catch of their try/catch
// express will send a 500, we can add logic for custom messages for specific errors here
app.use((err, req, res, next) => { // eslint-disable-line
  console.error(err.stack)
  res.status(500).send(err)
})

module.exports = app
