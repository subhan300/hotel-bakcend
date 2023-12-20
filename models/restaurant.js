const mongoose = require('mongoose');
const Modal = mongoose.model;
const restaurant = new mongoose.Schema({

  name: { type: String, require: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  logo: { type: String, required: true },
  bannerImg: { type: String, required: true },
  businessInfo: { type: String, required: true },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  description: { type: String, required: true },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Will cause an error because mongodb has an _id index by default that
// is not sparse
restaurant.index({ name: "text",description:"text" }, { sparse: true });
module.exports = new Modal('restaurant', restaurant);
restaurant.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error.message);
});