const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({

  title: String,
  content: String,
  author: {
    user_id: Number,
  },
  img: String,
  created_at: Date,
  updated_at: Date,
  comment: [{ 
    text: String,
    author: {
      user_id: Number,
    },
  }],
  like: [
    {
      user_id: Number,
    }
  ]

})

const model = mongoose.model('Blog', BlogSchema);
module.exports = model;