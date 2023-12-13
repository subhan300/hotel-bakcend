var mongoose = require('mongoose');

const category = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true },



});

const cusines = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true },
    img: { type: String, required: true }



});

const menuLikeItem = new mongoose.Schema({
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurantMenu',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },


    userLike: { type: Boolean, required: true }

});

const location = new mongoose.Schema({
    street: { type: String, required: true, lowercase: true },


});
module.exports = {
    category: new mongoose.model('category', category),
    location: new mongoose.model('location', location),
    cusines: new mongoose.model('cusines', cusines),
    menuLikeItem: new mongoose.model('menuLikeItem', menuLikeItem)
}