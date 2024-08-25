// controllers/userController.js
const User = require('../models/User');

class UserController {
    constructor(db) {
        this.userModel = new User(db);
    }

    async register(req, res) {
        try {
            const data = req.body;
            const userId = await this.userModel.createUser(data);
            res.status(201).json({ id: userId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.userModel.authenticate(email, password);
            if (!user) {
                res.status(401).json({ error: 'Invalid email or password' });
            } else {
                res.json({ message: 'Login successful', userId: user._id });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await this.userModel.findById(userId);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
            } else {
                res.json(user);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UserController;
