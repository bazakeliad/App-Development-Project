const User = require("../models/user");

async function login(username, password) {
    const user = await User.findOne({ _id: username, password: password });
    return user != null;
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