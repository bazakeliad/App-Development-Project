const Cart = require('../models/cart');
const Jersey = require('../models/jersey');

exports.updateCart = async (userId, jerseyId, quantity, size) => {
    // Find the existing cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        // If no cart exists, create a new one
        cart = new Cart({ userId, items: [] });
    }

    // Check if the jersey exists in the database
    const jersey = await Jersey.findById(jerseyId);
    if (!jersey) {
        throw new Error(`Item with ID ${jerseyId} not found`);
    }

    // Find the item in the cart by jerseyId and size
    const existingItem = cart.items.find(item => item.jerseyId === jerseyId && item.size === size);

    if (existingItem) {
        // If the item exists in the cart, increase the quantity
        existingItem.quantity += quantity;
    } else {
        // Otherwise, add the new item to the cart
        cart.items.push({
            jerseyId: jerseyId,
            size: size, // Store the selected size
            quantity: quantity,
            price: jersey.price
        });
    }

    // Save the updated cart
    return await cart.save();
};