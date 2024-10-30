const express = require("express")
const router = express.Router()

const loginController = require("../controllers/loginController");
const ordersController = require('../controllers/ordersController');
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');

router.get('/personalArea', loginController.isLoggedIn, loginController.personalArea);
router.get('/personalArea/orders', loginController.isLoggedIn, ordersController.getOrdersByUser);

router.get('/personalArea/profile', loginController.isLoggedIn, userController.getUserProfile);
router.post('/personalArea/profile', loginController.isLoggedIn, userController.updateUserProfile);

router.post('/personalArea/review', loginController.isLoggedIn, reviewController.createReview);
router.get('/personalArea/review', loginController.isLoggedIn, reviewController.renderAddReviewForm);

module.exports = router