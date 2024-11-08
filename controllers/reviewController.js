const reviewService = require('../services/reviewServices'); 
const jerseyService = require('../services/jerseysServices');
const userService = require('../services/userServices');

const renderAddReviewForm = async (req, res) => {
    try {
        const jerseys = await jerseyService.getAllJerseys();
        res.render('addReview', { jerseys });
    } catch (error) {
        console.error('Error fetching jerseys:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Create a review
const createReview = async (req, res) => {
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
const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getAllReviews();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a review
const updateReview = async (req, res) => {
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

const getReviewById = async (req, res) => {
    console.log('Fetching review by ID:', req.params.id);
    try {
        const review = await reviewService.getReviewById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.render('editReview', { review });
    } catch (error) {
        res.status(500).redirect('/pageNotFound');
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReview = await reviewService.deleteReview(id);
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGroupedReviews = async (req, res) => {
    try {
        const groupedReviews = await reviewService.getReviewsGroupedByRating();
        res.render('groupedReviews', { groupedReviews });
    } catch (error) {
        console.error('Error fetching grouped reviews:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getAllReviewsAdmin = async (req, res) => {
    try {
        const { userId, itemId, rating, startDate, endDate } = req.query;

        // Fetch all users and items for filter dropdowns
        const users = await userService.getAllUsers();
        const items = await jerseyService.getAllJerseys();

        // Build the filter object based on query parameters
        const filters = {};
        if (userId) {
            filters.userId = Array.isArray(userId) ? { $in: userId } : userId;
        }
        if (itemId) {
            filters.itemId = Array.isArray(itemId) ? { $in: itemId } : itemId;
        }
        if (rating) {
            
            // Convert ratings to an array of numbers and use $in for filtering
            const ratingsArray = Array.isArray(rating) ? rating.map(Number) : [Number(rating)];
            filters.rating = { $in: ratingsArray };
        }

        // Filter by date range if provided
        if (startDate || endDate) {
            filters.createdAt = {};
            if (startDate) filters.createdAt.$gte = new Date(startDate);
            if (endDate) filters.createdAt.$lte = new Date(endDate);
        }

        // Fetch the filtered reviews from the database
        const reviews = await reviewService.getFilteredReviews(filters);

        // Render the adminReviews EJS template with the provided data
        res.render('adminReviews', {
            reviews,
            users,
            items,
            userIds: Array.isArray(userId) ? userId : userId ? [userId] : [],
            itemIds: Array.isArray(itemId) ? itemId : itemId ? [itemId] : [],
            ratings: Array.isArray(rating) ? rating.map(Number) : rating ? [Number(rating)] : [],
            startDate,
            endDate
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    renderAddReviewForm,
    createReview,
    getAllReviews,
    updateReview,
    getReviewById,
    deleteReview,
    getGroupedReviews,
    getAllReviewsAdmin
};