var mongoose = require('mongoose');

const tryMenuItem = new mongoose.Schema({
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
module.exports = new mongoose.model('TryMenuItem', tryMenuItem);
