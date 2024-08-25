// models/Cart.js
const { ObjectId } = require('mongodb');

class Cart {
    constructor(db) {
        this.collection = db.collection('carts');
    }

    // Create a new cart for a user
    async createCart(userId) {
        const result = await this.collection.insertOne({
            userId: new ObjectId(userId),
            items: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return result.insertedId;
    }

    // Add item to cart
    async addItem(userId, item) {
        const cart = await this.collection.findOne({ userId: new ObjectId(userId) });
        if (!cart) {
            await this.createCart(userId);
        }
        const result = await this.collection.updateOne(
            { userId: new ObjectId(userId) },
            { 
                $push: { items: item },
                $set: { updatedAt: new Date() }
            }
        );
        return result.modifiedCount;
    }

    // Remove item from cart
    async removeItem(userId, itemId) {
        const result = await this.collection.updateOne(
            { userId: new ObjectId(userId) },
            { 
                $pull: { items: { itemId: new ObjectId(itemId) } },
                $set: { updatedAt: new Date() }
            }
        );
        return result.modifiedCount;
    }

    // Get cart by user ID
    async getCart(userId) {
        return await this.collection.findOne({ userId: new ObjectId(userId) });
    }

    // Clear cart by user ID
    async clearCart(userId) {
        const result = await this.collection.updateOne(
            { userId: new ObjectId(userId) },
            { $set: { items: [], updatedAt: new Date() } }
        );
        return result.modifiedCount;
    }
}

module.exports = Cart;
