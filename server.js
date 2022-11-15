const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtAuthenticate = require('express-jwt')
const SERVER_SECRET_KEY = 'TODO:secretchickenkey'
const Blog = require('./models/Blog')
const User = require('./models/User')
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
  const newBlog = {

    title: req.body.title,
    author: req.body.author,
    content: req.body.content,
    img: req.body.img,

  }
  const result = await Blog.create(newBlog);
  res.json(newBlog);
})

// To fake a post in iterm and test if a post works, use the Curl command below, use this to test if success/fail conditions are working
// curl -XPOST -d '{ "email":"one@one.com", "password":"chicken" }' http://localhost:3000/login -H 'content-type: application/json'
app.post('/login', async (req, res) => {
  console.log('login:', req.body)
  const {email, password} = req.body
  try {
    const user = await User.findOne({email})
    
    if (user && bcrypt.compareSync(password, user.passwordDigest)){
      // res.json({success: true})
      const token = jwt.sign({
          _id: user._id
      },
        SERVER_SECRET_KEY, 
        {expiresIn: '72h'}
      )
      const filterUser = {
        name: user.name,
        email: user.email,
      }

      res.json({token, filterUser})

    } else {
      res.status(401).json({success: false})
    }
  }catch(err){
    console.log('error verfying credentials:', err)
    res.sendStatus(500)
  }
})
