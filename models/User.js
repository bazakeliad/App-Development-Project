// models/User.js
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

class User {
    constructor(db) {
        this.collection = db.collection('users');
    }

    // Create a new user
    async createUser(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await this.collection.insertOne(user);
        return result.insertedId;
    }

    // Find a user by email
    async findByEmail(email) {
        return await this.collection.findOne({ email });
    }

    // Find a user by ID
    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    // Authenticate user
    async authenticate(email, password) {
        const user = await this.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
}

module.exports = User;
