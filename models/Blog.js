const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({

  title: {type: String, required: true},
  content: String,
  author: {
    user_id: Number,
  },
  img: String,
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

BlogSchema.set('timestamps', true)

const model = mongoose.model('Blog', BlogSchema);
module.exports = model;