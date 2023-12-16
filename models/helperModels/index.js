var mongoose = require('mongoose');

const category = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true },



});

const type = new mongoose.Schema({
    type: { type: String, required: true, lowercase: true },



});

const cusines = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true },
    img: { type: String, required: true }



});

const menuLikeItem = new mongoose.Schema({
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurantMenu',
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

   restaurantId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'restaurant',
    required:false
   },
    userLike: { type: Boolean, required: true }

});

const location = new mongoose.Schema({
    street: { type: String, required: true, lowercase: true },


});
module.exports = {
    category: new mongoose.model('category', category),
    type: new mongoose.model('type', type),
    location: new mongoose.model('location', location),
    cusines: new mongoose.model('cusines', cusines),
    menuLikeItem: new mongoose.model('menuLikeItem', menuLikeItem)
}