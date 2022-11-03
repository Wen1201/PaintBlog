const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
  content: String,
  author: String,
  created_at: Date,
  updated_at: Date,
  comment: [{ 
    text: String,
    author: {
      user_id: Number,
    },
  }],
})