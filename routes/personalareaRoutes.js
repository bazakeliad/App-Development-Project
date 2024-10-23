const express = require("express")
const router = express.Router()

const loginController = require("../controllers/loginController");
const ordersController = require('../controllers/ordersController');
const userController = require('../controllers/userController');


router.get('/personalArea', loginController.isLoggedIn, loginController.personalArea);
router.get('/personalArea/orders', loginController.isLoggedIn, ordersController.getOrdersByUser);
//router.get('/personalArea/profile', loginController.isLoggedIn, loginController.);

// Ensure the user is logged in and only allow them to access their own profile
router.get('/personalArea/profile', loginController.isLoggedIn, userController.getUserProfile);
router.post('/personalArea/profile', loginController.isLoggedIn, userController.updateUserProfile);

module.exports = router;

module.exports = router