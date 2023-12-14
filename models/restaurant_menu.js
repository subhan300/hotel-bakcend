const mongoose = require('mongoose');
const Modal = mongoose.model;
const restaurantMenu = new mongoose.Schema({
  menuInfo: { type: String, required: false },
  price: { type: Number, required: true },
  dish: { type: String, require: true },
  img: { type: String, required: true },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'restaurant',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cusines: {
    required: true,
  type: mongoose.Schema.Types.ObjectId,
  },
  type:{
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  }
});
module.exports = new Modal('restaurantMenu', restaurantMenu);
