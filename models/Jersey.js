// models/Jersey.js
const { ObjectId } = require('mongodb');

class Jersey {
    constructor(db) {
        this.collection = db.collection('jerseys');
    }

    // Create a new jersey
    async create(data) {
        // Validate the input data
        const jerseyData = {
            name: data.name,
            team: data.team,
            price: data.price,
            size: data.size,
            stock: data.stock,
            description: data.description,
        };

        const result = await this.collection.insertOne(jerseyData);
        return result.insertedId;
    }

    // Get all jerseys
    async getAll() {
        return await this.collection.find({}).toArray();
    }

    // Get a single jersey by ID
    async getById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    // Update a jersey by ID
    async update(id, data) {
        const updateData = {
            $set: {
                name: data.name,
                team: data.team,
                price: data.price,
                size: data.size,
                stock: data.stock,
                description: data.description,
            },
        };

        const result = await this.collection.updateOne(
            { _id: new ObjectId(id) },
            updateData
        );
        return result.modifiedCount;
    }

    // Delete a jersey by ID
    async delete(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount;
    }
}

module.exports = Jersey;
