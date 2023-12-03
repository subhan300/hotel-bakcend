var mongoose = require('mongoose');

var review = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    title: { type: String, required: true },
    review: { type: String, required: true },
    foodQuality: { type: Number, required: true },
    service: { type: Number, required: true },
    location: { type: Number, required: true },
    price: { type: Number, required: true },




    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = new mongoose.model('review', review);
