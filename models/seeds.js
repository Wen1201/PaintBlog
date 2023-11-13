
const mongoose = require('mongoose');
const User = require('./User');
const Blog = require('./Blog');
mongoose.connect('mongodb://127.0.0.1:27017/pb');
const bcrypt = require('bcrypt');
const path = require('path');
const express = require('express');
const app = express();

// Serve static files from the 'public' directory
app.use("/public", express.static(path.join(__dirname, 'public')));



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

             {
                name: 'User',
                email: 'user@ga.com',
                passwordDigest: bcrypt.hashSync('chicken', 10),
            },
        ]
        
    
        
    )
    
    console.log('users', users);

    await Blog.deleteMany();
    const blogs = await Blog.create(

        [
            {
                title: 'Modern and Old',
                author: users[0],
                content: 'Beauty of women, and greek gods',
                img: 'https://res.cloudinary.com/du7c4cskj/image/upload/v1699437232/fine_art_jvn64d.png',
                comment: [
                    {
                        text: 'Stunning, artwork',
                        author: users[0]
                    },
                    {
                        text: 'Great work!',
                        author: users[1]
                    },
                    {
                        text: "The best!",
                        author: users[2]
                    }
                    
                ],
                like: [ users[0], users[1]]
            },
            {
                title: 'Parisian Life',
                author: users[0],
                content: 'Rainy mornings with a view',
                img: 'https://res.cloudinary.com/du7c4cskj/image/upload/v1699436982/Paris_rpvbd1.png',
                comment: [
                    {
                        text: 'Such beauty.',
                        author: users[0]
                    },
                    {
                        text: 'Wow, such amazing art.',
                        author: users[1]
                    },
                    {
                        text: "Speechless.",
                        author: users[2]
                    }
                    
                ],
                like: [users[1], users[2]]

            },
            {
                title: 'Life in the forest',
                author: users[0],
                content: 'Beautiful and stunning woods with sunshine',
                img: 'https://res.cloudinary.com/du7c4cskj/image/upload/v1699439700/beatiful_woods_f8svmm.png',
                comment: [
                    {
                        text: 'This was such a great experience',
                        author: users[0]
                    },
                    {
                        text: 'Amazing work',
                        author: users[1]
                    },
                    {
                        text: "Surely, this was difficult to paint",
                        author: users[2]
                    }
                    
                ],
                like: [users[0], users[1], users[2]]

            },
            {
                title: 'Mountains, and a stream',
                author: users[0],
                content: 'Connecting the stream, forest and mountain together in one art work',
                img: 'https://res.cloudinary.com/du7c4cskj/image/upload/v1699439703/forest_ezdqxa.png',
                comment: [
                    {
                        text: 'This is the single most amazing picture',
                        author: users[0]
                    },
                    {
                        text: 'This blog post is amazing',
                        author: users[1]
                    },
                    {
                        text: "Wow",
                        author: users[2]
                    }
                    
                ],
                like: [users[0], users[1], users[2]]

            },
            {
                title: 'Three Horses',
                author: users[1],
                content: 'Beautiful horses wondering around',
                img: 'https://res.cloudinary.com/du7c4cskj/image/upload/v1699439704/horses_awi3wd.png',
                comment: [
                    {
                        text: 'Colours look so amazing',
                        author: users[0]
                    },
                    {
                        text: 'This blog post is good',
                        author: users[1]
                    },
                    {
                        text: "The best",
                        author: users[2]
                    }
                    
                ],
                like: [users[0], users[1], users[2]]

            },
            {
                title: 'Ice and Wolf',
                author: users[1],
                content: 'Wolf laying in the snow',
                img: 'https://res.cloudinary.com/du7c4cskj/image/upload/v1699439705/lonley_fox_ya9inl.png',
                comment: [
                    {
                        text: 'The eyes are stunning',
                        author: users[0]
                    },
                    {
                        text: 'This is such a good painting',
                        author: users[1]
                    },
                    {
                        text: "Great work",
                        author: users[2]
                    }
                    
                ],
                like: [users[0], users[1], users[2]]

            },
            {
                title: 'Greek gods',
                author: users[1],
                content: 'Ancient Greek Gods touching fingers',
                img: 'https://res.cloudinary.com/du7c4cskj/image/upload/v1699439705/img1_y2ldxf.png',
                comment: [
                    {
                        text: 'Great work',
                        author: users[0]
                    },
                    {
                        text: 'I want to buy this',
                        author: users[1]
                    },
                    {
                        text: "Surely, this is stunning",
                        author: users[3]
                    }
                    
                ],
                like: [users[0], users[1], users[2]]

            },
            {
                title: 'Female watercolor art',
                author: users[1],
                content: 'Beautiful and colourful art work of women',
                img: 'https://res.cloudinary.com/du7c4cskj/image/upload/v1699439708/portrait_f8kwzl.png',
                comment: [
                    {
                        text: 'This is the single most amazing picture',
                        author: users[0]
                    },
                    {
                        text: 'This blog post is great.',
                        author: users[1]
                    },
                    
                ],
                like: [users[0], users[1], users[2]]

            },
            {
                title: 'Farm house',
                author: users[2],
                content: 'Farm house painting historical',
                img: 'https://res.cloudinary.com/du7c4cskj/image/upload/v1699439709/country_side_pzakkh.png',
                comment: [
                    {
                        text: 'Such a great art work',
                        author: users[0]
                    },
                    {
                        text: 'Impressive work',
                        author: users[1]
                    },
                    {
                        text: "The colours.... wow",
                        author: users[2]
                    }
                    
                ],
                like: [users[0], users[1], users[2]]

            },
            {
                title: 'Taylor Swift',
                author: users[2],
                content: 'Old and modern meet with a twist with a classic',
                img: 'https://res.cloudinary.com/du7c4cskj/image/upload/v1699439711/taylor_swift_yo9d2k.png',
                comment: [
                    {
                        text: 'I need this piece',
                        author: users[0]
                    },
                    {
                        text: 'I love Taylor',
                        author: users[1]
                    },
                    {
                        text: "The colours.... wow",
                        author: users[2]
                    }
                    
                ],
                like: [users[0], users[1], users[2]]

            },
            {
                title: 'Floating Mountains',
                author: users[2],
                content: 'Floating mountains with trees and waves',
                img: 'https://res.cloudinary.com/du7c4cskj/image/upload/v1699439714/floating_islands_rmvlrw.png',
                comment: [
                    {
                        text: 'Such a great art work',
                        author: users[0]
                    },
                    {
                        text: 'Impressive work',
                        author: users[1]
                    },
                    {
                        text: "The colours.... wow",
                        author: users[2]
                    }
                    
                ],
                like: [users[0], users[1], users[2]]

            },
            {
                title: 'Color within Color',
                author: users[2],
                content: 'Colourful mixture of color',
                img: 'https://res.cloudinary.com/du7c4cskj/image/upload/v1699439717/paint_and_paint_oca0a6.png',
                comment: [
                    {
                        text: 'Great color work',
                        author: users[0]
                    },
                    {
                        text: 'Impressive work',
                        author: users[1]
                    },
                    {
                        text: "The colours.... wow",
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





