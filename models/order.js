const mongoose = require('mongoose');
const jersey = require('./order');
const Schema = mongoose.Schema;

const order = new Schema ({
    username: {
        // need to update later
    },
    totalPrice: {
        type: Number,
        required: true
    },
    jerseys:{
        type: Array,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    paymentMethod:{
        type: String,
        enum: ["creditCard","cash"]
    }
})