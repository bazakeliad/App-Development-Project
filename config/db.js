// config/db.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';  // Change to your MongoDB URI if needed
const client = new MongoClient(uri);

async function connectDB() {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('jerseyStore');
}

module.exports = connectDB;
