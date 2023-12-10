var mongoose = require('mongoose');

const review = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    review: { type: String, required: true },
    rating: { type: Number ,required:true},
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = new mongoose.model('review', review);
