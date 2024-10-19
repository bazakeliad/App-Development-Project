const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HoursSchema = new Schema({
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    openingTime: {
        type: String, // You can use Date or String depending on your needs
        required: true
    },
    closingTime: {
        type: String,
        required: true
    }
});

const BranchSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    coordinates: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    hours: [HoursSchema] // Array of opening hours
}, { timestamps: true });

module.exports = mongoose.model('Branch', BranchSchema);
