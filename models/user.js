const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  _id: String,
  password: {
    type: String,
    required: true,
  },
  email: { 
    type: String, 
    required: true
  },
  team: { 
    type: String
  },
  is_admin: {
    type: Boolean,
    default: false,  
  }
});

module.exports = mongoose.model("User", User);