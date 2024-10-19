const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Jersey' // Assuming you have an Item model
    },
    message: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', reviewSchema);
