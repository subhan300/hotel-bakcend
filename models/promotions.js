const mongoose = require('mongoose');
const Modal = mongoose.model;
const promotion = new mongoose.Schema({
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
    openingAt: {
        type: String,
        required:true,
    },
});
module.exports = new Modal('promotion', promotion);
