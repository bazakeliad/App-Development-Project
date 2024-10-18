const Cart = require('../models/cart');
const Order = require('../models/order');
const Item = require('../models/jersey');
const cartServices = require('../services/cartServices')

// Create or update a cart
exports.updateCart = async (req, res) => {
    const { userId, items } = req.body; // Accept items as an array
    try {
        // Create an array to hold updated items with prices
        const cart = await cartServices.updateCart(userId, items)
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get cart by user ID
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Convert cart to order
exports.checkoutCart = async (req, res) => {
    const { userId, address } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        
         // Calculate total price and prepare order items
        const items = cart.items.map(item => ({
            itemId: item.itemId, // Assuming itemId is in the cart item
            quantity: item.quantity // Capture the quantity from the cart
        }));
        const totalPrice = cart.items.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        const order = new Order({
            userId,
            totalPrice,
            address,
            items,
            status: 'pending'
        });

        await order.save();
        await Cart.findOneAndDelete({ userId }); // Clear the cart after checkout

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an item from the cart
exports.deleteItemFromCart = async (req, res) => {
    const { userId, itemId } = req.body;
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { itemId } } },
            { new: true }
        );
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
