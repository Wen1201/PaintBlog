const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    passwordDigest: {
        type: String, required: true
    },

})

const model = mongoose.model('User', UserSchema);
module.exports = model;