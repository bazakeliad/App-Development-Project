const express = require('express');
const { renderAddReviewForm, createReview, getAllReviews, updateReview, deleteReview } = require('../controllers/reviewController');

const router = express.Router();

// importing login controller for protecting admin routes
const loginController = require("../controllers/loginController");

// Create a new review
router.post('/', createReview);

// Get all reviews
router.get('/', getAllReviews);

// Update a review by ID
router.put('/:id', updateReview);

// Delete a review by ID
router.delete('/:id', deleteReview);

// router.post('/add', loginController.isLoggedIn, createReview);

// router.get('/add', loginController.isLoggedIn, renderAddReviewForm);

module.exports = router;

