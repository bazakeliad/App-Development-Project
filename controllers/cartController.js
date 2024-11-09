const Cart = require('../models/cart');
const Order = require('../models/order');
const Jersey = require('../models/jersey');
const cartServices = require('../services/cartServices');
const jerseyService = require('../services/jerseysServices');
const emailService = require('../services/emailServices');
const userService = require('../services/userServices');

// Delete cart
const deleteCart = async (req, res) => {
    try {
        const cart = await cartServices.deleteCart(req.params.id);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json({ message: 'Cart deleted successfully' }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update cart
const updateCart = async (req, res) => {
    const jerseyId = req.query.id;
    const quantity = parseInt(req.body.quantity) || 1;
    const size = req.body.size || 'N/A';
    const userId = req.session.username;

    try {
        await cartServices.updateCart(userId, jerseyId, quantity, size);
        res.status(200).json({ message: 'Cart updated' });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get cart
const getCart = async (req, res) => {
    const userId = req.session.username;
    try {
        const cart = await Cart.findOne({ userId });

        // If no cart is found in the database, initialize an empty cart
        if (!cart) {
            return res.render('cart', { cartItems: [], subtotal: 0, userId });
        }
        const cartItems = await Promise.all(
            cart.items.map(async (item) => {
                const jersey = await Jersey.findById(item.jerseyId);
                if (jersey) {
                    return {
                        itemId: item.jerseyId,
                        team: jersey.team,
                        kitType: jersey.kitType,
                        price: jersey.price,
                        size: item.size,
                        quantity: item.quantity,
                        image: jersey.image
                    };
                }
                return null;
            })
        );

        const filteredCartItems = cartItems.filter((item) => item !== null);
        const subtotal = filteredCartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        res.render('cart', { cartItems: filteredCartItems, subtotal, userId });

    } 
    catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ message: error.message });
    }
};

// Render the checkout page where users enter their details
const checkoutPage = (req, res) => {
    const userId = req.session.username;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    res.render('checkout', { userId });
};

// Convert cart to order (checkout)
const checkoutCart = async (req, res) => {
    const userId = req.session.username;
    const { fullName, address, city, zip, country, cardNumber, cardExpiry, cardCVC } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Fetch user email and name
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Retrieve jersey details for each item in the cart
        const itemsWithDetails = await Promise.all(
            cart.items.map(async (item) => {
                const jersey = await jerseyService.getJerseyById(item.jerseyId);
                return {
                    itemId: item.jerseyId,
                    quantity: item.quantity,
                    size: item.size,
                    price: item.price,
                    team: jersey.team,  
                    kitType:jersey.kitType
                };
            })
        );

        // Calculate the total price
        const totalPrice = itemsWithDetails.reduce((total, item) => total + item.price * item.quantity, 0);

        // Save the order
        const order = new Order({
            userId,
            totalPrice,
            address: `${address}, ${city}, ${zip}, ${country}`,
            items: itemsWithDetails,
            status: 'pending'
        });

        await order.save();
        await Cart.findOneAndDelete({ userId });

        // Send confirmation email
        await emailService.sendOrderConfirmationEmail(user.email, user.name, {
            items: itemsWithDetails,
            totalPrice,
            address: `${address}, ${city}, ${zip}, ${country}`
        });

        // If successful, mark the checkout as successful
        cartServices.markCheckoutSuccess(req.session);

        res.redirect('/cart/checkoutSuccess');
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(400).json({ message: error.message });
    }
};

// Render the checkout success page
const checkoutSuccess = (req, res) => {

    // If successful, mark the checkout as successful
    cartServices.resetCheckoutSuccess(req.session);

    res.render('checkoutSuccess');
};


// Delete an item from the cart
const deleteItemFromCart = async (req, res) => {
    const { itemId, size } = req.body;
    const userId = req.session.username;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => !(item.jerseyId === itemId && item.size === size));

        await cart.save();
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: error.message });
    }
};

// Middleware to check if the checkout sequence is valid
function checkCheckoutSequence(req, res, next) {
    const currentRoute = req.originalUrl;

    if (currentRoute === '/cart') {
        cartServices.resetCheckoutSuccess(req.session);
        return next();
    }

    if (currentRoute === '/cart/checkout') {
        return next();
    }

    if (currentRoute === '/cart/checkoutSuccess') {
        if (cartServices.validateCheckoutSuccess(req.session)) {
            return next();
        }
        return res.redirect('/cart/checkout');
    }

    next();
}

// Check if the cart is empty before proceeding to checkout
function checkCartNotEmpty(req, res, next) {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
        
        // Redirect to /cart with an error message if the cart is empty
        return res.redirect('/cart?error=empty');
    }
    next();
}

module.exports = {
    deleteCart,
    updateCart,
    getCart,
    checkoutPage,
    checkoutCart,
    checkoutSuccess,
    deleteItemFromCart,
    checkCheckoutSequence,
    checkCartNotEmpty
};