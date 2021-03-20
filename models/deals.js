const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const dealSchema = new Schema({
    id:{
        type: Number,
        required: true,
        unique:true
    },
    transport: {
        type: String,
        required: true,
    },
    departure: {
        type: String,
        required: true,
    },
    arrival: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    reference: {
        type: String,
        required: true,
    },

},{
    timestamps: true
});

var Deals = mongoose.model('Deal', dealSchema);

module.exports = Deals;