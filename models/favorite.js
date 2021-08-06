const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favDishSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
},{
    timestamps: true
});

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes : [ favDishSchema ]
},{
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorites;