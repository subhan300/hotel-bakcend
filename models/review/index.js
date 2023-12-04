var mongoose = require('mongoose');

const review = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    title: { type: String, required: true },
    review: { type: String, required: true, min: 1, max: 5 },
    foodQuality: { type: Number, required: true, min: 1, max: 5 },
    service: { type: Number, required: true, min: 1, max: 5 },
    location: { type: Number, required: true, min: 1, max: 5 },
    price: { type: Number, required: true, min: 1, max: 5 },




    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = new mongoose.model('review', review);
