var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    status: {
        type: Boolean,

        required: true,
    },



    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = new mongoose.model('user', user);
