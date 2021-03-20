const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({

    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },

},{
    timestamps: true
});

var Places = mongoose.model('Place',placeSchema );

module.exports = Places;