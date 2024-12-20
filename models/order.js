const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    address: {
        type: String,
        required: true
    },
    items: [{
        itemId: { 
            type: String, 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true, 
            min: 1
        },
        size: {
            type: String,
            required: true
        }
    }],
    status: {
        type: String,
        required: true,
        enum: ['pending', 'shipped', 'delivered', 'canceled']
    }
}, {timestamps: true});

module.exports = mongoose.model('Order', OrderSchema);
