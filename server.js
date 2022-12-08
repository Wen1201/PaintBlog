const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtAuthenticate = require('express-jwt')
const Blog = require('./models/Blog')
const User = require('./models/User')
const app = express()
const PORT = process.env.PORT || 3000

const cors = require('cors')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config()
console.log(process.env.SERVER_SECRET_KEY)

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
  const blogs = await Blog.find().populate('author', 'name');
  res.json(blogs);
})

// show route for blogs/:id
app.get('/blogs/:id', async (req, res) => {
  // console.log('made it!', req);
  try {
    const blog = await Blog.findOne({
      _id: req.params.id
    })
    .populate('author', 'name')
    .populate('comment.author', 'name')
    .populate('like')
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
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    
    if (user && bcrypt.compareSync(password, user.passwordDigest)) {
      // res.json({success: true})
      const token = jwt.sign({
        _id: user._id
      },
      process.env.SERVER_SECRET_KEY,
      { expiresIn: '72h' }
      )
      const filterUser = {
        name: user.name,
        email: user.email,
      }
      
      res.json({ token, filterUser })
      
    } else {
      res.status(401).json({ success: false })
    }
  } catch (err) {
    console.log('error verfying credentials:', err)
    res.sendStatus(500)
  }
})

// signup route
app.post('/signup', async (req, res) => {
  
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    passwordDigest: bcrypt.hashSync(req.body.password, 10)
  })
  
  try {
    const savedUser = await newUser.save();
    console.log('Saved user:', savedUser);
    const token = jwt.sign(
      {
        _id: savedUser._id
      },
      process.env.SERVER_SECRET_KEY,
      {
        expiresIn: '72h'
      }
      )
      console.log('token', token);
      res.json({ token, savedUser })
    } catch (error) {
      console.log('Error verifying login', error);
      res.sendStatus(500);
    }
    
  })
  
  // **** routes below this line only work for authenticated users ****
  
  const checkAuth = () => {
    return jwtAuthenticate.expressjwt({
      secret: process.env.SERVER_SECRET_KEY,
      algorithms: ['HS256'],
      requestProperty: 'auth'
    })
  }

  app.use(checkAuth());

  app.use(async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.auth._id })
      // TODO: add the .populate method to include any associations of the User data (e.g. blogs, comments) 
      if (user === null) {
      res.sendStatus(401);
    } else {
      req.current_user = user;
      console.log(`req.current_user = `, req.current_user)
      next();
    }
  } catch (error) {
    console.log('Error querying user in authentication', error)
    res.sendStatus(500)
  }
});

// All routes below now have req.current_user defined
app.get('/current_user', (req, res) => {
  console.log('route /current_user reached');
  res.json(req.current_user)
})

// Adding comments to an existing blogPost
app.post('/blogs/:id/comment', async(req, res) => {
  console.log('comment', req.body);

  const newComment = {
    text: req.body.comment,
    author: req.current_user
  }

  console.log(newComment);
  try{
    const result = await Blog.updateOne(
      {_id: req.params.id},
      {
        $push: {
          comment: newComment
        }
      }
    )
    console.log('result of one update', result)
    res.json('ok')
  }catch(err){
    console.error('error updating comments', err)
    res.sendStatus(422)
  }

}) // Update Comment

// Adding a like to a BlogPost
// Current user ID is being returned and also Liked User ID is being return
app.post('/blogs/:id/like', async(req, res) => {
  
  try{
    const current_blog = await Blog.findOne(
      {_id: req.params.id}

      )
    const userId = req.current_user._id
    const likeArray = current_blog.like
    const existsInLikeArray = [];
    for (let i = 0; i < likeArray.length; i++){
      if(userId.toString() === likeArray[i].toString()){
        console.log(`Success, UserId:${userId.toString()} is the same as LikeArray[${i}]:${likeArray[i].toString()}`)
    existsInLikeArray.push(userId)
  }
}
  if(existsInLikeArray.length === 0){
    console.log('MongoDB - trying to add userId to likes Array')
    result = await Blog.updateOne(
      {_id: req.params.id},
      {
        $push: {
          like: userId
        }
      }
    )
  } else {
    console.log('MongoDB - trying to remove userId from likes Array')
    result = await Blog.updateOne(
      {_id: req.params.id},
      {
        $pull: {
          like: userId
        }
      }
    )
  }
  const blog_after_update = await Blog.findOne(
    {_id: req.params.id}

    )
  console.log('Blog like array after update:', blog_after_update.like)


  }
  catch (err){
    console.error('error finding BlogPost Like', err)
    res.sendStatus(422)
  }
  // When you hit the like end point
  // Code should check/search if current blog post already contains that user in the like array

  // If user_id is present, remove from the array
  // If user_id is not present, add user to array

})
