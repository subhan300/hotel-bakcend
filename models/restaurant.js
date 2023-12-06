const mongoose = require('mongoose');
const Modal = mongoose.model;
const restaurant = new mongoose.Schema({

  name: { type: String, require: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  logo: { type: String, required: true },
  location: { type: String, required: true },
  menus: { type: Array, required: true },
  description: { type: String, required: true },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = new Modal('restaurant', restaurant);
