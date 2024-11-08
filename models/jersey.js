const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JerseySchema = new Schema({
    team: {
        type: String,
        required: true
    },
    teamTwitterHandle: {
        type: String,
        required: false
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
    images: [{
        data: Buffer,
        contentType: String
    }],
    sizes: {
        type: [String],
        required: true
    },
    category: {
        type: String,
        default: 'Jerseys'
    },
    description: {
        type: String,
        default: ''
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Jersey', JerseySchema);
