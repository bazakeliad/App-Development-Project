const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const loginController = require('../controllers/loginController');

// Define routes
router.post('/createOrder', ordersController.createOrder);
router.get('/getAllOrders', ordersController.getAllOrders);
router.get('/getOrderById/:id', ordersController.getOrderById);
router.get('/getOrderByStatus', ordersController.getOrdersByStatus);
router.put('/updateOrderById/:id', ordersController.updateOrder);
router.delete('/deleteOrderById/:id', ordersController.deleteOrder);

module.exports = router;
