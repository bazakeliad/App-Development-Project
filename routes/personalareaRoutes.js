const express = require("express")
const router = express.Router()

// Import controllers
const loginController = require("../controllers/loginController");
const ordersController = require('../controllers/ordersController');
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');

// Personal Area routes
router.get('/', loginController.isLoggedIn, loginController.personalArea);
router.get('/orders', loginController.isLoggedIn, ordersController.getOrdersByUser);
router.get('/profile', loginController.isLoggedIn, userController.getUserProfile);
router.post('/profile', loginController.isLoggedIn, userController.updateUserProfile);
router.post('/review', loginController.isLoggedIn, reviewController.createReview);
router.get('/review', loginController.isLoggedIn, reviewController.renderAddReviewForm);

module.exports = router