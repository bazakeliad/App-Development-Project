const Review = require('../models/review'); // Adjust the path as necessary

// Create a review
const createReview = async (userId, itemId, message, rating) => {
    const review = new Review({ userId, itemId, message, rating });
    return await review.save();
};

// Get all reviews
const getAllReviews = async () => {
    return await Review.find(); // Add any necessary filters
};

// Get a review by ID
const getReviewById = async (id) => {
    try {
        return await Review.findById(id);  // Find review by ID
    } catch (error) {
        throw new Error('Error retrieving review by ID');
    }
};

// Update a review
const updateReview = async (id, updateData) => {
    return await Review.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete a review
const deleteReview = async (id) => {
    return await Review.findByIdAndDelete(id);
};

module.exports = {
    createReview,
    getAllReviews,
    getReviewById, 
    updateReview,
    deleteReview
};
