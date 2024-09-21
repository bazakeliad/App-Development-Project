const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JerseySchema = new Schema ({
    team: {
        type: String,
        required: true
    },
    kitType: {
        type: String,
        required: true
    },
    price: {
        type: Number, // Changed to Number
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    // Optional fields
    sizes: {
        type: [String], // Array of sizes
        default: []
    },
    category: {
        type: String,
        default: 'Jerseys'
    }
});

module.exports = mongoose.model('Jersey', JerseySchema);
