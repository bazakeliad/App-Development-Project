const User = require("../models/user");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

async function login(username, password) {
    const user = await User.findOne({ _id: username });
    if (!user) {
        return false; 
    }

    
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    return isPasswordMatch;
}

async function register(name, username, password, email, team) {
    const user = new User({
        name,    
        _id: username, 
        password,
        email,       
        team         
    });

    await user.save();
}

module.exports = { 
    login, 
    register 
};