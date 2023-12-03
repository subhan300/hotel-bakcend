const mongoose = require('mongoose');
const Modal = mongoose.model;
const featuredRestaurant = new mongoose.Schema({
    expireDate: { type: String, required: true },
    discount: { type: String, required: true },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant',
        required: true,
    },
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurantMenu',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = new Modal('featuredRestaurant', featuredRestaurant);
