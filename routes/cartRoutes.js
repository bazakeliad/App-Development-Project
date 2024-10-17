const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Define routes
router.post('/updateCart', cartController.updateCart);
router.get('/getCart/:userId', cartController.getCart);
router.post('/checkoutCart', cartController.checkoutCart);
router.delete('/deleteItemFromCart', cartController.deleteItemFromCart);

module.exports = router;
