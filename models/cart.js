const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    userId: {
        type: Number,
        required: true
    },
    items: [{
        itemId: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
