// controllers/cartController.js
const Cart = require('../models/Cart');

class CartController {
    constructor(db) {
        this.cartModel = new Cart(db);
    }

    async addToCart(req, res) {
        try {
            const userId = req.params.userId;
            const item = req.body; // { itemId: '...', quantity: ... }
            const result = await this.cartModel.addItem(userId, item);
            res.json({ message: 'Item added to cart', modifiedCount: result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async removeFromCart(req, res) {
        try {
            const userId = req.params.userId;
            const itemId = req.params.itemId;
            const result = await this.cartModel.removeItem(userId, itemId);
            res.json({ message: 'Item removed from cart', modifiedCount: result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCart(req, res) {
        try {
            const userId = req.params.userId;
            const cart = await this.cartModel.getCart(userId);
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async clearCart(req, res) {
        try {
            const userId = req.params.userId;
            const result = await this.cartModel.clearCart(userId);
            res.json({ message: 'Cart cleared', modifiedCount: result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CartController;
