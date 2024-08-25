// controllers/orderController.js
const Order = require('../models/Order');

class OrderController {
    constructor(db) {
        this.orderModel = new Order(db);
    }

    async createOrder(req, res) {
        try {
            const userId = req.params.userId;
            const items = req.body.items;
            const orderId = await this.orderModel.createOrder(userId, items);
            res.status(201).json({ id: orderId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOrders(req, res) {
        try {
            const userId = req.params.userId;
            const orders = await this.orderModel.getOrdersByUserId(userId);
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const orderId = req.params.orderId;
            const status = req.body.status;
            const result = await this.orderModel.updateOrderStatus(orderId, status);
            res.json({ message: 'Order status updated', modifiedCount: result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = OrderController;
