const Review = require('../models/review');

// Create a review
const createReview = async (userId, itemId, message, rating) => {
    const review = new Review({ userId, itemId, message, rating });
    return await review.save();
};

// Get all reviews
const getAllReviews = async () => {
    return await Review.find();
};

// Get a review by ID
const getReviewById = async (id) => {
    try {
        return await Review.findById(id);
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

const getFilteredReviews = async (filters) => {
    return await Review.find(filters);
};

const getReviewsGroupedByRating = async () => {
    try {
        const groupedReviews = await Review.aggregate([
            {
                // Group by the `rating` field and count how many reviews there are for each rating
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        return groupedReviews;
    } catch (error) {
        console.error('Error fetching grouped reviews:', error);
        throw new Error('Error fetching grouped reviews');
    }
};

const getReviewsByJerseyId = async (jerseyId) => {
    try {
        return await Review.find({ itemId: jerseyId }).exec();
    } catch (error) {
        console.error('Error fetching reviews for jersey:', error);
        return [];
    }
};

module.exports = {
    createReview,
    getAllReviews,
    getReviewById, 
    updateReview,
    deleteReview,
    getFilteredReviews,
    getReviewsGroupedByRating,
    getReviewsByJerseyId
};
