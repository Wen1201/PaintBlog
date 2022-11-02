let db;
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.0.1:27017', { }, (err, client) => {
    if(err){
        console.log('error connecting to mongoDB server', err);
        process.exit(1);
    }
    db = client.db('pb');
    insertBlogs();

});

const insertBlogs = () => {

    db.collection('blogs').insertMany([
        {
            title: 'My new blog post',
            author: 'Mo',
            content: 'Lorem functionality does not work',
            img:  'http://fillmurray/200/200',
        },
        {
            title: 'My new blog post',
            author: 'Mo',
            content: 'Lorem functionality does not work',
            img:  'http://fillmurray/200/200',
        },
        {
            title: 'My new blog post',
            author: 'Mo',
            content: 'Lorem functionality does not work',
            img:  'http://fillmurray/200/200',
        },
    ])


}


