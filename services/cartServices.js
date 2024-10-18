const Cart = require('../models/cart');
const Jersey = require('../models/jersey');

exports.updateCart = async (userId, jerseyId, quantity) => {
    // Find the existing cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        // If no cart exists, create a new one
        cart = new Cart({ userId, items: [] });
    }

    // Check if the item exists in the database
    const jersey = await Jersey.findById(jerseyId);
    if (!jersey) {
        throw new Error(`Item with ID ${jerseyId} not found`);
    }

    // Find the item in the cart
    const existingItem = cart.items.find(item => item.jerseyId === jerseyId);

    if (existingItem) {
        // Set the quantity directly to the new value (instead of adding)
        existingItem.quantity = quantity;
    } else {
        // Otherwise, add the new item to the cart
        cart.items.push({
            jerseyId: jerseyId,
            quantity: quantity, // Set quantity directly
            price: jersey.price
        });
    }

    // Save the updated cart
    return await cart.save();
};
