// routes/cartRoutes.js
const express = require('express');
const CartController = require('../controllers/cartController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Cart management
 */

/**
 * @swagger
 * /carts/{userId}:
 *   get:
 *     summary: Get cart by user ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user's cart
 *       404:
 *         description: Cart not found
 */
router.get('/:userId', (req, res) => {
    const db = req.app.locals.db;
    const cartController = new CartController(db);
    cartController.getCart(req, res);
});

/**
 * @swagger
 * /carts/{userId}/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Carts]
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
 *               itemId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The item was added to the cart
 *       500:
 *         description: Internal server error
 */
router.post('/:userId/add', (req, res) => {
    const db = req.app.locals.db;
    const cartController = new CartController(db);
    cartController.addToCart(req, res);
});

/**
 * @swagger
 * /carts/{userId}/remove/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The item ID
 *     responses:
 *       200:
 *         description: The item was removed from the cart
 *       404:
 *         description: Item not found in the cart
 *       500:
 *         description: Internal server error
 */
router.delete('/:userId/remove/:itemId', (req, res) => {
    const db = req.app.locals.db;
    const cartController = new CartController(db);
    cartController.removeFromCart(req, res);
});

/**
 * @swagger
 * /carts/{userId}/clear:
 *   post:
 *     summary: Clear the user's cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The cart was cleared
 *       500:
 *         description: Internal server error
 */
router.post('/:userId/clear', (req, res) => {
    const db = req.app.locals.db;
    const cartController = new CartController(db);
    cartController.clearCart(req, res);
});

module.exports = (db) => router;
