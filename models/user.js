const mongoose = require('mongoose');

const User = new mongoose.Schema({
  _id: String,
  password: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Boolean,
    default: false,  
  }
});

module.exports = mongoose.model("User", User);