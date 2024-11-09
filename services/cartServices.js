const Cart = require('../models/cart');
const Jersey = require('../models/jersey');

const deleteCart = async (cartId) => {
    return await Cart.findByIdAndDelete(cartId);
};

const deleteCartByUserId = async (userId) => {
    return await Cart.findOneAndDelete({ userId });
};


const updateCart = async (userId, jerseyId, quantity, size) => {

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
            size: size,
            quantity: quantity,
            price: jersey.price
        });
    }

    // Save the updated cart
    return await cart.save();
};

// This function checks if the user has followed the correct route sequence
function validateCheckoutSequence(session, currentRoute) {
    if (currentRoute === '/cart') {
        session.cartVisited = true;
        session.checkoutVisited = false;
        session.checkoutSuccessVisited = false;
        return true;
    }

    if (currentRoute === '/cart/checkout') {
        if (!session.cartVisited) return false;
        session.checkoutVisited = true;
        session.checkoutSuccessVisited = false;
        return true;
    }

    if (currentRoute === '/cart/checkoutSuccess') {
        if (!session.checkoutVisited) return false;
        session.checkoutSuccessVisited = true;
        return true;
    }

    return false;
}

function markCheckoutSuccess(session) {
    session.checkoutSuccess = true;
}

function validateCheckoutSuccess(session) {
    return session.checkoutSuccess === true;
}

function resetCheckoutSuccess(session) {
    session.checkoutSuccess = false;
}

module.exports = { 
    deleteCart,
    deleteCartByUserId,
    updateCart,
    validateCheckoutSequence,
    markCheckoutSuccess,
    validateCheckoutSuccess,
    resetCheckoutSuccess
};