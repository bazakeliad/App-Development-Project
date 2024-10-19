const mongoose = require('mongoose');
const jersey = require('./jersey');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    items: [{
        jerseyId: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
