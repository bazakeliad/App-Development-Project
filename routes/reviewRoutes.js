const express = require('express');
const { createReview, getAllReviews, updateReview, deleteReview } = require('../controllers/reviewController');

const router = express.Router();

// Create a new review
router.post('/', createReview);

// Get all reviews
router.get('/', getAllReviews);

// Update a review by ID
router.put('/:id', updateReview);

// Delete a review by ID
router.delete('/:id', deleteReview);

module.exports = router;

