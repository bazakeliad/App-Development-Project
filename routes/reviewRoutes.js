const express = require('express');
const router = express.Router();

// Import controllers
const reviewController = require('../controllers/reviewController');
const loginController = require('../controllers/loginController');

// Reviews routes
router.get('/', loginController.isLoggedAsAdmin, reviewController.getAllReviewsAdmin);
router.delete('/:id', loginController.isLoggedAsAdmin, reviewController.deleteReview);
router.get('/edit/:id', loginController.isLoggedAsAdmin, reviewController.getReviewById);
router.post('/edit/:id', loginController.isLoggedAsAdmin, reviewController.updateReview);

module.exports = router;

