const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({

  title: {type: String, required: true},
  content: String,
  author: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId
  },
  img: String,
  comment: [{ 
    text: String,
    author: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId
    },
  }],
  like: [
    {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId
    }
  ]

})

BlogSchema.set('timestamps', true)

const model = mongoose.model('Blog', BlogSchema);
module.exports = model;