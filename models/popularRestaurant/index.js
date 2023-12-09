const mongoose = require('mongoose');
const Modal = mongoose.model;
const popularRestaurant = new mongoose.Schema({
    expireDate: { type: String, required: true },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant',
        required: true,
    },

  
});
module.exports = new Modal('popularRestaurant', popularRestaurant);
