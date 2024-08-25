// routes/orderRoutes.js
const express = require('express');
const OrderController = require('../controllers/orderController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders/{userId}:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: The order was created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/:userId', (req, res) => {
    const db = req.app.locals.db;
    const orderController = new OrderController(db);
    orderController.createOrder(req, res);
});

/**
 * @swagger
 * /orders/{userId}:
 *   get:
 *     summary: Get all orders for a user
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of orders
 *       500:
 *         description: Internal server error
 */
router.get('/:userId', (req, res) => {
    const db = req.app.locals.db;
    const orderController = new OrderController(db);
    orderController.getOrders(req, res);
});

/**
 * @swagger
 * /orders/{orderId}/status:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: The order status was updated
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.put('/:orderId/status', (req, res) => {
    const db = req.app.locals.db;
    const orderController = new OrderController(db);
    orderController.updateOrderStatus(req, res);
});

module.exports = (db) => router;
