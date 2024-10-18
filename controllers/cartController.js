const Cart = require('../models/cart');
const Order = require('../models/order');
const Jersey = require('../models/jersey');
const cartServices = require('../services/cartServices');

// Create or update a cart (adding one item at a time)
exports.updateCart = async (req, res) => {
    const jerseyId = req.query.id; // Accept jerseyId from the query parameters
    const quantity = parseInt(req.body.quantity) || 1; // Get the quantity (default to 1 if not provided)
    const userId = req.session.username; // Use session userId

    try {
        const cart = await cartServices.updateCart(userId, jerseyId, quantity);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get cart by user ID
exports.getCart = async (req, res) => {
    const userId = req.session.username;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.render('cart', { cartItems: [], subtotal: 0, userId });

        // Fetch jersey details for each item in the cart
        const cartItems = await Promise.all(
            cart.items.map(async (item) => {
                const jersey = await Jersey.findById(item.jerseyId);
                if (jersey) {
                    return {
                        itemId: item.jerseyId,
                        team: jersey.team,
                        kitType: jersey.kitType,
                        price: jersey.price,
                        size: item.size || 'N/A',
                        quantity: item.quantity,
                        image: jersey.image
                    };
                }
                return null;
            })
        );

        // Filter out any null items (in case some jerseys weren't found)
        const filteredCartItems = cartItems.filter((item) => item !== null);

        // Calculate the subtotal
        const subtotal = filteredCartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        // Render the cart.ejs template with cart data
        res.render('cart', { cartItems: filteredCartItems, subtotal, userId });
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Convert cart to order (checkout)
exports.checkoutCart = async (req, res) => {
    const userId = req.session.username;
    const { address } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Prepare order items and calculate total price
        const items = cart.items.map(item => ({
            itemId: item.jerseyId,
            quantity: item.quantity
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
    const { itemId } = req.body;
    const userId = req.session.username;
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { jerseyId: itemId } } },
            { new: true }
        );
        if (!cart) return res.status(200).json({ items: [] }); // Return empty cart
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
