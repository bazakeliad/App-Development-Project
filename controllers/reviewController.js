const reviewService = require('../services/reviewServices'); // Adjust the path as necessary

// Create a review
exports.createReview = async (req, res) => {
    const { userId, itemId, message, rating } = req.body;

    try {
        const review = await reviewService.createReview(userId, itemId, message, rating);
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getAllReviews();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    const { id } = req.params;
    const { message, rating } = req.body;

    try {
        const updatedReview = await reviewService.updateReview(id, { message, rating });
        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReview = await reviewService.deleteReview(id);
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
