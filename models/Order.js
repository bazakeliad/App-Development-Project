// models/Order.js
const { ObjectId } = require('mongodb');

class Order {
    constructor(db) {
        this.collection = db.collection('orders');
    }

    // Create a new order
    async createOrder(userId, items) {
        const order = {
            userId: new ObjectId(userId),
            items: items,
            createdAt: new Date(),
            status: 'pending'
        };
        const result = await this.collection.insertOne(order);
        return result.insertedId;
    }

    // Get all orders by user ID
    async getOrdersByUserId(userId) {
        return await this.collection.find({ userId: new ObjectId(userId) }).toArray();
    }

    // Update order status
    async updateOrderStatus(orderId, status) {
        const result = await this.collection.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status: status } }
        );
        return result.modifiedCount;
    }
}

module.exports = Order;
