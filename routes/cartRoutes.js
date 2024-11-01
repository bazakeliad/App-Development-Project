const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const loginController = require("../controllers/loginController");

// Define routes
router.post('/updateCart', loginController.isLoggedIn, cartController.updateCart);
router.post('/checkoutCart', loginController.isLoggedIn, cartController.checkoutCart);
router.delete('/deleteItemFromCart', loginController.isLoggedIn, cartController.deleteItemFromCart);
router.get('/', loginController.isLoggedIn, cartController.checkCheckoutSequence, cartController.getCart);
router.get('/checkoutSuccess', loginController.isLoggedIn, cartController.checkCheckoutSequence, cartController.checkoutSuccess);
router.get('/checkout', loginController.isLoggedIn, cartController.checkCheckoutSequence, cartController.checkCartNotEmpty, cartController.checkoutPage);

module.exports = router;
