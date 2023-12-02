const mongoose = require('mongoose');
const Modal = mongoose.model;
const restaurant = new mongoose.Schema({
  name: { type: String, require: false },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  logo: { type: String, required: false },
  location: { type: Object },
 
 
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = new Modal('restaurant', restaurant);
