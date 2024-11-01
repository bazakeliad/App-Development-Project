const express = require('express');
const router = express.Router();

// Import controllers
const orderController = require('../controllers/ordersController');
const adminController = require('../controllers/adminController');
const loginController = require('../controllers/loginController');

// Orders routes
router.get('/', loginController.isLoggedAsAdmin, adminController.getAllOrdersAdmin);
router.post('/updateStatus/:id', loginController.isLoggedAsAdmin, orderController.updateOrderStatus);
router.delete('/deleteOrderById/:id', loginController.isLoggedAsAdmin, orderController.deleteOrder);

module.exports = router;
