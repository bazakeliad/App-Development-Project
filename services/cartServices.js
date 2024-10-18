const Cart = require("../models/cart");
const Item = require('../models/jersey');

exports.updateCart = async (userId, items) => {
    // Find the existing cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        // If no cart exists, create a new one
        cart = new Cart({ userId, items: [] });
    }
    // Create a map to handle existing items in the cart
    const itemMap = new Map(cart.items.map(item => [item.itemId, item]));
    // Loop through new items to add/update quantities
    for (const { itemId, quantity } of items) {
        if (quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: `Item with ID ${itemId} not found` });
        }
        // Check if the item already exists in the cart
        if (itemMap.has(itemId)) {
            // Update the quantity if it exists
            itemMap.get(itemId).quantity = quantity;
        } else {
            // Otherwise, add the new item
            itemMap.set(itemId, { itemId, quantity, price: item.price });
        }
    }
    // Convert the map back to an array for the cart
    cart.items = Array.from(itemMap.values());
    // Save the updated cart
    return await cart.save();
};

