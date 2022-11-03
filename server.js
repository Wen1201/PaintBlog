const express = require('express')

const app = express()

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost/${PORT}`)
})

const mongoose = require('mongoose')
const Blog = require('./models/Blog')

mongoose.connect('mongodb://127.0.0.1/pb')

const db = mongoose.connection

app.get('/', (req, res) => {
  console.log('Root route was requested')
  res.json({hello: 'there'})
})