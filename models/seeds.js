
const mongoose = require('mongoose');
const User = require('./User');
const Blog = require('./Blog');
mongoose.connect('mongodb://127.0.0.1:27017/pb');
const bcrypt = require('bcrypt');

const db = mongoose.connection;

db.on('error', err => {
    console.log('db connection err', err);
    process.exit(1)
})

db.once('open', async() => {

    console.log('Success! DB connected, model loaded');
    await User.deleteMany();
    const users = await User.create(
        [
            {
                name: 'Dee',
                email: 'dee@ga.com',
                passwordDigest: bcrypt.hashSync('chicken', 10),
            },
            {
                name: 'Mo',
                email: 'mo@ga.com',
                passwordDigest: bcrypt.hashSync('chicken', 10),
            },
            {
                name: 'Wen',
                email: 'wen@ga.com',
                passwordDigest: bcrypt.hashSync('chicken', 10),
            },
            
        ]
        
    
        
    )
    
    console.log('users', users);

    await Blog.deleteMany();
    const blogs = await Blog.create(

        [
            {
                title: 'My new blog post',
                author: users[1],
                content: 'Lorem functionality does not work',
                img: 'https://placekitten.com/200/200',
                comment: [
                    {
                        text: 'This is the single most amazing picture of fillmurray I\'ve ever seen',
                        author: users[0]
                    },
                    {
                        text: 'This blog post is rubbish. What is this?',
                        author: users[1]
                    },
                    {
                        text: "Surely you can do better",
                        author: users[2]
                    }
                    
                ],
                like: [ users[0], users[1]]
            },
            {
                title: 'life after SEI55',
                author: users[0],
                content: 'Backend engineering jokes',
                img: 'https://placekitten.com/200/300',
                comment: [
                    {
                        text: 'This is the single most amazing picture of fillmurray I\'ve ever seen',
                        author: users[0]
                    },
                    {
                        text: 'This blog post is rubbish. What is this?',
                        author: users[1]
                    },
                    {
                        text: "Surely you can do better",
                        author: users[2]
                    }
                    
                ],
                like: [users[1], users[2]]

            },
            {
                title: 'Life in Hobart',
                author: users[2],
                content: 'Beautiful and boring',
                img: 'https://placekitten.com/300/200',
                comment: [
                    {
                        text: 'This is the single most amazing picture of fillmurray I\'ve ever seen',
                        author: users[0]
                    },
                    {
                        text: 'This blog post is rubbish. What is this?',
                        author: users[1]
                    },
                    {
                        text: "Surely you can do better",
                        author: users[2]
                    }
                    
                ],
                like: [users[0], users[1], users[2]]

            },
        ],

    )
    console.log('blogs', blogs)


    
   
    process.exit(0)
        
})




// const insertBlogs = ()

// const promiseFindBlogs = () => {

//     return new Promise((resolve, reject) => {
//         db.collection('blogs').find().toArray((err, blogs) => {
//             if (err) {
//                 // console.log('Error retrieving blogs', err);
//                 // return;
//                 reject(err)
//             }
//             // console.log('Blogs', blogs);
//             resolve(blogs)
//         })
//     })
   
// }

// const printBlogs = () => {
//     // db.collection('blogs').find().toArray((err, blogs) => {
//     //     if (err) {
//     //         console.log('error retrieving blogs', err);
//     //         return;
//     //     }
//     //     console.log('blogs', blogs);
//     //     process.exit(0);
//     // })
//     promiseFindBlogs()
//     .then(data => {
//         console.log('blogs', data)
//         process.exit(0)
//     })
//     .catch(err => {
//         console.log('err',err);
//         process.exit(1)
//     })
// }





