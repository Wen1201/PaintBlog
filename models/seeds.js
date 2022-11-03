
const mongoose = require('mongoose');
const Blog = require('./Blog');
mongoose.connect('mongodb://127.0.0.1:27017/pb');

const db = mongoose.connection;

db.on('error', err => {
    console.log('db connection err', err);
    process.exit(1)
})

db.once('open', async() =>{
    console.log('success db connected', model loaded);
    const blogs = await Blog.find()
    console.log('blogs', blogs)
    process.exit(0)
})

const insertBlogs = ()

const promiseFindBlogs = () => {
    return new Promise((resolve, reject) => {
        db.collection('blogs').find().toArray((err, blogs) => {
            if (err) {
                // console.log('Error retrieving blogs', err);
                // return;
                reject(err)
            }
            // console.log('Blogs', blogs);
            resolve(blogs)
        })
    })
   
}

const printBlogs = () => {
    // db.collection('blogs').find().toArray((err, blogs) => {
    //     if (err) {
    //         console.log('error retrieving blogs', err);
    //         return;
    //     }
    //     console.log('blogs', blogs);
    //     process.exit(0);
    // })
    promiseFindBlogs()
    .then(data => {
        console.log('blogs', data)
        process.exit(0)
    })
    .catch(err => {
        console.log('err',err);
        process.exit(1)
    })
}





