const mongoose = require('mongoose');
const Modal = mongoose.model;
const promotion = new mongoose.Schema({
    expireDate: { type: String, required: true },
    dish: { type: String, required: true },
    discount: { type: String, required: true },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant',
        required: true,
    },
    restaurantName: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = new Modal('promotion', promotion);
