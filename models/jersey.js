const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JerseySchema = new Schema({
    team: {
        type: String,
        required: true
    },
    kitType: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        data: Buffer,
        contentType: String
    },
    // New field: Array of images for the carousel
    images: [{
        data: Buffer,
        contentType: String
    }],
    // Optional fields
    sizes: {
        type: [String], // Array of sizes
        default: []
    },
    category: {
        type: String,
        default: 'Jerseys'
    },
    // New field: Description of the jersey
    description: {
        type: String,
        default: ''
    },
    // New field: Indicates if the jersey is featured on the homepage
    isFeatured: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Jersey', JerseySchema);
