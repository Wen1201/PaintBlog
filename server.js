const express = require('express')

const app = express()

const PORT = 3000

const cors = require('cors')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
  res.json({ hello: 'there' })
})

// index route for blogs
app.get('/blogs', async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
})

// show route for blogs/:id
app.get('/blogs/:id', async (req, res) => {
  // console.log('made it!', req);
  try {
    const blog = await Blog.findOne({
      _id: req.params.id
    });
    console.log('blog', blog);
    res.json(blog)
  } catch (err) {
    console.error('Error, could not find blog', err);
    res.sendStatus(422)
  }

})

// create a new blot
app.post('/blogs', async (req, res) => {
  console.log('create /blogs post', req.body);
  // try {
  // } catch (error) {

  // }
})