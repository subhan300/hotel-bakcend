const mongoose = require('mongoose');
const Modal = mongoose.model;
const restaurantMenu = new mongoose.Schema({
    menuInfo:{type:String,required:false},
  dishes: { type: Array, require: true },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'restaurant',
    required: true,
  },
 

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = new Modal('restaurantMenu', restaurantMenu);
