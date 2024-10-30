const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const loginController = require('../controllers/loginController');

// Define routes
router.delete('/deleteOrderById/:id', ordersController.deleteOrder);

module.exports = router;
