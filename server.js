const express = require('express')
const Blog = require('./models/Blog')
const User = require('./models/User')
const app = express()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})


// Require cors
const cors = require('cors')
app.use(cors());

// To get access to POSTed 'formdata' body content
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// require dotenv library
require('dotenv').config()

// call the dotenv variables
const SERVER_SECRET_KEY = process.env.SERVER_SECRET_KEY;
console.log(process.env.SERVER_SECRET_KEY)

// ************ Authentication *********************** //
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtAuthenticate = require('express-jwt')


// Refresh token setup
const refreshTokenList = {};
const generateRefreshToken = (userId) => {
    const refreshToken = jwt.sign({userId}, process.env.SERVER_SECRET_KEY, {expiresIn: '7d'});
    refreshTokenList[refreshToken] = userId;
    return refreshToken;
}

// Check Authentication
const checkAuth = () => {
  return jwtAuthenticate.expressjwt({
    secret: process.env.SERVER_SECRET_KEY,
    algorithms: ['HS256'],
    requestProperty: 'auth',
    getToken: function (req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      }
      return null;
    },
  });
};



// require mongoose
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/pb')

const db = mongoose.connection
db.on('error', err => {
  console.log('Error connecting to server', err)
  process.exit(1)
})



// ************ Below are the Links **************

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
  console.log('login:', req.body);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.passwordDigest)) {
      const token = jwt.sign({ _id: user._id }, process.env.SERVER_SECRET_KEY, { expiresIn: '72h' });
      const refreshToken = generateRefreshToken(user._id);
      const filterUser = {
        name: user.name,
        email: user.email,
      };
      res.json({ token, refreshToken, filterUser });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (err) {
    console.log('error verifying credentials:', err);
    res.sendStatus(500);
  }
});

// Refresh token route
app.post('/refresh-token', (req, res) => {
  // Retrieve the refresh token from the request body
  const { refreshToken } = req.body;

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.SERVER_SECRET_KEY, (err, decoded) => {
    if (err) {
      // If refresh token is invalid or expired, respond with 401 Unauthorized
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Check if the refresh token exists in the list of valid refresh tokens
    if (refreshTokenList[refreshToken] !== decoded.userId) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign({ _id: decoded.userId }, process.env.SERVER_SECRET_KEY, { expiresIn: '72h' });

    // Return the new access token
    res.json({ accessToken: newAccessToken });
  });
});


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
      const refreshToken = generateRefreshToken(savedUser._id);
      console.log('token', token);
      res.json({token, refreshToken});

    } catch (error) {
      console.log('Error verifying login', error);
      res.sendStatus(500);
    }
    
  })
  
  // **** routes below this line only work for authenticated users ****
  
  
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


// Updating Blog Posts 

// app.post('/blogs/:id/edit', async (req, res) => {
//   const { title, content, img } = req.body.updates;

//   try {
//     const updatedBlog = await Blog.updateOne(
//       { _id: req.params.id },
//       {
//         $set: { title: req.body.ti, content, img } // Use $set to update fields, not $push
//       }
//     );

//     if (updatedBlog.nModified > 0) {
//       res.json('ok');
//     } else {
//       res.sendStatus(404); // Blog post not found
//     }
//   } catch (err) {
//     console.error('Error updating blog post:', err);
//     res.sendStatus(500);
//   }
// });

app.post('/blogs/:id/edit', async(req,res) => {

  console.log('Blog Edits: ', req.body);

  try{
    const blogEdit = await Blog.updateOne(
      {_id: req.params.id},
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          img: req.body.img
        }
      }
    )
    console.log('blog updated :', blogEdit);
    res.json('ok');

  } catch(err){
    console.error('error updating comments', err)
    res.sendStatus(422)
  }
});

// Adding comments to an existing blogPost
// This code Maybe needs to change
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
app.post('/blogs/:id/like', async (req, res) => {
  try {
    const current_blog = await Blog.findOne({ _id: req.params.id });
    
    if (!current_blog) {
      return res.sendStatus(404);
    }
  
    const userId = req.current_user._id;
    const likeArray = current_blog.like;
  
    const existsInLikeArray = likeArray.filter((id) => id.toString() === userId.toString());
  
    if (existsInLikeArray.length === 0) {
      await Blog.updateOne(
        { _id: req.params.id },
        {
          $push: {
            like: userId,
          },
        }
      );
    } else {
      await Blog.updateOne(
        { _id: req.params.id },
        {
          $pull: {
            like: userId,
          },
        }
      );
    }
  
    const updatedBlog = await Blog.findOne({ _id: req.params.id });
    res.json(updatedBlog.like);
    // res.json(updatedBlog.like.length);
  } catch (err) {
    console.error('Error finding/updating blog post', err);
    res.sendStatus(500);
  }
});

// Delete a blog post by ID
app.delete('/blogs/:id/delete', async (req, res) => {
  try {
      const id = req.params.id;
      const deletedBlog = await Blog.findOneAndDelete({ _id: id });

      if (deletedBlog) {
          res.status(204).send();
      } else {
          res.status(404).json({ error: 'Blog post not found' });
      }
  } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
