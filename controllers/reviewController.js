const reviewService = require('../services/reviewServices'); // Adjust the path as necessary

const jerseyService = require('../services/jerseysServices');

exports.renderAddReviewForm = async (req, res) => {
    try {
        const jerseys = await jerseyService.getAllJerseys();
        res.render('addReview', { jerseys });
    } catch (error) {
        console.error('Error fetching jerseys:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Create a review
exports.createReview = async (req, res) => {
    const { itemId, message, rating } = req.body;
    const userId = req.session.username;

    try {
        await reviewService.createReview(userId, itemId, message, parseInt(rating));

        // Redirect to personalArea with success message
        res.redirect('/personalArea/review?message=Review added successfully&type=success');
    } catch (error) {
        console.error('Error creating review:', error);
        // Redirect to personalArea with error message
        res.redirect('/personalArea/review?message=Error adding review&type=error');
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
        const updateData = {
            message,
            rating: parseInt(rating, 10)
        };

        const updatedReview = await reviewService.updateReview(id, updateData);
        if (!updatedReview) {
            return res.redirect('/admin/reviews?message=Review not found&type=error');
        }

        // Redirect with success message
        res.redirect('/admin/reviews?message=Review updated successfully&type=success');
    } catch (error) {
        console.error('Error updating review:', error);
        // Redirect with error message
        res.redirect('/admin/reviews?message=Error updating review&type=error');
    }
};



exports.getReviewById = async (req, res) => {
    console.log('Fetching review by ID:', req.params.id);  // Check if this log is printed
    try {
        const review = await reviewService.getReviewById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.render('editReview', { review });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
