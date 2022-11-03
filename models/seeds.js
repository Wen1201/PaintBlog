let db;
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017', {}, (err, client) => {
    if (err) {
        console.log('error connecting to mongoDB server', err);
        process.exit(1);
    }
    db = client.db('pb');
    db.collection('blogs').deleteMany({}, (err, result) => {
        if (!err) {
            insertBlogs();
        }
    });

});

const insertBlogs = () => {

    db.collection('blogs').insertMany([
        {
            title: 'My new blog post',
            author: 'Mo',
            content: 'Lorem functionality does not work',
            img: 'https://www.fillmurray.com/200/200',
        },
        {
            title: 'life after SEI55',
            author: 'Dee',
            content: 'Backend engineering jokes',
            img: 'https://www.fillmurray.com/200/200',
        },
        {
            title: 'Life in Hobart',
            author: 'Wen',
            content: 'Beautiful and boring',
            img: 'https://www.fillmurray.com/200/200',
        },
    ],
        (err, result) => {
            if (err) {
                console.log('Error inserting blog posts', err);
                return;
            }
            console.log(`Success! added ${result.insertedCount} Blog posts`);
            // process.exit(0); // no errors
            printBlogs();
        }
    )

}

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





