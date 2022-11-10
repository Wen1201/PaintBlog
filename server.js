const express = require('express')

const app = express()

const PORT = 3000

const cors = require('cors')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

const mongoose = require('mongoose')
const Blog = require('./models/Blog')

mongoose.connect('mongodb://127.0.0.1/pb')

const db = mongoose.connection
db.on('error', err => {
  console.log('Error connecting to server', err)
  process.exit(1)
})

app.get('/', (req, res) => {
  console.log('Root route was requested')
  res.json({hello: 'there'})
})

app.get('/blogs', async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
})

app.get('/blogs/:id', async (req, res) => {

  try{
    const blog = await Blog.find({
      _id: req.params.id
    });
    console.log('blog', blog);
    res.json(blog)
  } catch( err ){
    console.error('Error, could not find blog', err);
    res.sendStatus(422)
  }
  
})