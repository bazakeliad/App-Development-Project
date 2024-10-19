// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// importing login controller for protecting routes that change data
const loginController = require("../controllers/loginController");

// Define routes
router.post('/updateCart', loginController.isLoggedIn, cartController.updateCart);
router.get('/getCart/:userId', loginController.isLoggedIn, cartController.getCart);
router.post('/checkoutCart', loginController.isLoggedIn, cartController.checkoutCart);
router.delete('/deleteItemFromCart', loginController.isLoggedIn, cartController.deleteItemFromCart);
router.get('/', loginController.isLoggedIn, cartController.getCart)

module.exports = router;
