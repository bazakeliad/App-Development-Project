const jerseysServices = require('../services/jerseysServices');
const multer = require('multer');
const Order = require('../models/order');
const Jersey = require('../models/jersey');  // Import the Jersey model
const reviewService = require('../services/reviewServices'); // Adjust the path as necessary
const userService = require('../services/userServices'); // For user filtering
const orderService = require('../services/orderServices'); // For user filtering
const axios = require('axios');

// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Dashboard: View statistics and latest orders
const getDashboard = async (req, res) => {
    try {
        // Get total orders, total revenue, and total jerseys
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalJerseys = await jerseysServices.getJerseyCount();

        // Fetch latest orders (optional: you can limit to a specific number)
        const latestOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

        // Orders by Month: Group by year and month and count orders
        const ordersByMonth = await Order.aggregate([
            {
                $group: {
                    _id: { 
                        year: { $year: { $toDate: "$createdAt" } },  // Ensure $toDate conversion
                        month: { $month: { $toDate: "$createdAt" } } 
                    },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]).exec();

        // Transform ordersByMonth data into a format that D3 can consume
        const ordersByMonthData = ordersByMonth.map(item => ({
            month: `${item._id.year}-${item._id.month}`,
            orders: item.orders
        }));

        // Revenue Over Time: Group by year and month and sum the totalPrice
        const revenueOverTime = await Order.aggregate([
            {
                $group: {
                    _id: { 
                        year: { $year: { $toDate: "$createdAt" } },  // Ensure $toDate conversion
                        month: { $month: { $toDate: "$createdAt" } }
                    },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]).exec();
        
        // New: Fetch grouped reviews by rating
        const reviewsGroupedByRating = await reviewService.getReviewsGroupedByRating();

        // Transform revenueOverTime data into a format D3 can consume
        const revenueOverTimeData = revenueOverTime.map(item => ({
            month: `${item._id.year}-${item._id.month}`,
            revenue: item.revenue
        }));

        // Order Status Distribution: Group by order status
        const orderStatusDistribution = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]).exec();

        // Transform orderStatusDistribution data into D3 format
        const orderStatusDistributionData = orderStatusDistribution.map(item => ({
            status: item._id,
            count: item.count
        }));

        // Render the dashboard with the calculated data
        res.render('adminDashboards.ejs', {
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalJerseys,
            latestOrders,
            ordersByMonth: ordersByMonthData,
            revenueOverTime: revenueOverTimeData,
            orderStatusDistribution: orderStatusDistributionData,
            reviewsGroupedByRating
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Display all jerseys in admin panel
const getAllJerseysAdmin = async (req, res) => {
    try {
        const jerseys = await jerseysServices.getAllJerseys();
        res.render('adminJerseys.ejs', { jerseys, title: 'Manage Jerseys' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Display admin console
const getAdminConsole = (req, res) => {
    try {
        res.render('adminConsole.ejs'); // Render the admin console page
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Display form to add a new jersey
const getAddJerseyForm = (req, res) => {
    res.render('addJersey.ejs', { title: 'Add New Jersey' });
};

const addJersey = async (req, res) => {
    const { team, teamTwitterHandle, kitType, price, allSizes, description } = req.body;
    const imageFile = req.file;

    // Check if allSizes is undefined or empty
    if (!allSizes || (Array.isArray(allSizes) && allSizes.length === 0)) {
        return res.redirect('/admin/jerseys/add?error=1');
    }

    const sizesArray = Array.isArray(allSizes) ? allSizes : [allSizes];
    const jerseyData = {
        team,
        teamTwitterHandle,
        kitType,
        price: parseFloat(price),
        sizes: sizesArray,
        image: {
            data: imageFile.buffer,
            contentType: imageFile.mimetype
        },
        description
    };

    try {
        // Save the jersey to the database
        await jerseysServices.createJersey(jerseyData);
        require('dotenv').config(); // Load environment variables
        // Facebook API Post
        const pageAccessToken = process.env.FACEBOOK_TOKEN;  // Add your Facebook Page Access Token here
        const facebookPageId = process.env.FACEBOOK_PAGE_ID;  // Add your Facebook Page ID here
        
        const message = `New Jersey Added: ${team} (${kitType} Kit) now available for $${price}. Sizes: ${sizesArray.join(', ')}.`;
        // const message = 'Hi, test project API' 
        const fbResponse = await axios.post(`https://graph.facebook.com/${facebookPageId}/feed`, {
            message,
            access_token: pageAccessToken
        });

        console.log('Facebook Post ID:', fbResponse.data.id);

        res.redirect('/admin/jerseys');
    } catch (error) {
        console.error('Error adding jersey or posting to Facebook:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Display form to edit a jersey
const getEditJerseyForm = async (req, res) => {
    const id = req.params.id;
    try {
        const jersey = await jerseysServices.getJerseyById(id);
        if (!jersey) {
            return res.status(404).redirect('/pageNotFound');
        }
        res.render('editJersey.ejs', { jersey, title: 'Edit Jersey' });
    } catch (error) {
        console.error(error);
        res.status(500).redirect('/pageNotFound');
    }
};

const editJersey = async (req, res) => {
    const id = req.params.id;
    const { team, teamTwitterHandle, kitType, price, category, description } = req.body;
    const sizesArray = req.body.allSizes || [];  // If no sizes are selected, default to an empty array
    const imageFile = req.file;  // Check if an image was uploaded

    const updateData = {
        team,
        teamTwitterHandle,
        kitType,
        price: parseFloat(price),
        sizes: sizesArray,
        category,
        description
    };

    // Only update the image if a new one was uploaded
    if (imageFile) {
        updateData.image = {
            data: imageFile.buffer,
            contentType: imageFile.mimetype
        };
    }

    try {
        const jersey = await jerseysServices.updateJerseyById(id, updateData);
        if (!jersey) return res.status(404).send('Jersey not found');
        res.redirect(`/admin/jerseys?message=Jersey updated successfully&type=success`);
    } catch (error) {
        console.error('Error updating jersey:', error);
        res.redirect(`/admin/jerseys?message=Error updating jersey&type=error`);
    }
};



// Serve jersey image
const getJerseyImage = async (req, res) => {
    const id = req.params.id;
    try {
        const jersey = await jerseysServices.getJerseyById(id);
        if (!jersey || !jersey.image || !jersey.image.data) {
            return res.status(404).send('Image not found');
        }
        res.contentType(jersey.image.contentType);
        res.send(jersey.image.data);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Internal Server Error');
    }
};
const getAllOrdersAdmin = async (req, res) => {
    try {
        const { username, status, startDate, endDate, minPrice, maxPrice } = req.query;

        // Debugging: Log the received filter values
        console.log('Filter values:', { username, status, startDate, endDate, minPrice, maxPrice });

        const filter = {};

        // Filter by username
        if (username) {
            console.log('Filtering by username:', username);
            filter.userId = { $in: Array.isArray(username) ? username : [username] };
        }

        // Filter by status
        if (status) {
            console.log('Filtering by status:', status);
            filter.status = { $in: Array.isArray(status) ? status : [status] };
        }

        // Filter by date range
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
            console.log('Filtering by date range:', { startDate, endDate });
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            filter.totalPrice = {};
            if (minPrice) filter.totalPrice.$gte = parseFloat(minPrice);
            if (maxPrice) filter.totalPrice.$lte = parseFloat(maxPrice);
            console.log('Filtering by price range:', { minPrice, maxPrice });
        }

        // Fetch filtered orders
        let orders = await orderService.getAllOrders(filter);
        const users = await userService.getAllUsers(); // For the filter options

        // Fetch jersey details for each order
        orders = await getOrdersWithJerseyDetails(orders);

        // Render the orders view with filter selections
        res.render('adminOrders', {
            orders,
            users,
            usernames: Array.isArray(username) ? username : (username ? [username] : []),
            statuses: Array.isArray(status) ? status : (status ? [status] : []),
            startDate,
            endDate,
            minPrice,
            maxPrice
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Helper function to fetch jersey details for each item in an order
const getOrdersWithJerseyDetails = async (orders) => {
    const jerseysServices = require("../services/jerseysServices"); // Adjust path as necessary

    for (let order of orders) {
        for (let item of order.items) {
            try {
                const jersey = await jerseysServices.getJerseyById(item.itemId);
                if (jersey) {
                    item.jerseyDetails = {
                        team: jersey.team,
                        kitType: jersey.kitType,
                        image: jersey.image, // Assuming image is an object with data and contentType
                        size: item.size // Assuming size is part of the item information
                    };
                } else {
                    console.warn(`Jersey with ID ${item.itemId} not found`);
                }
            } catch (error) {
                console.error(`Error fetching jersey details for ID ${item.itemId}:`, error);
            }
        }
    }
    return orders;
};


const getAllReviewsAdmin = async (req, res) => {
    try {
        const { userId, itemId, rating, startDate, endDate } = req.query;

        // Fetch all users and items for filter dropdowns
        const users = await userService.getAllUsers();
        const items = await jerseysServices.getAllJerseys(); // Assuming items are jerseys

        // Build the filter object based on query parameters
        const filters = {};
        if (userId) filters.userId = userId;
        if (itemId) filters.itemId = itemId;
        if (rating) filters.rating = { $in: rating }; // Match any of the ratings

        // Filter by date range if provided
        if (startDate || endDate) {
            filters.createdAt = {};
            if (startDate) filters.createdAt.$gte = new Date(startDate);
            if (endDate) filters.createdAt.$lte = new Date(endDate);
        }

        const reviews = await reviewService.getFilteredReviews(filters);

        res.render('adminReviews', {
            reviews,
            users,
            items,
            userIds: Array.isArray(userId) ? userId : [userId],
            itemIds: Array.isArray(itemId) ? itemId : [itemId],
            ratings: Array.isArray(rating) ? rating : [rating],
            startDate,
            endDate
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAdminConsole,
    getAllJerseysAdmin,
    getAddJerseyForm,
    addJersey,
    getEditJerseyForm,
    editJersey,
    getJerseyImage,
    getAllOrdersAdmin,
    getDashboard,
    getAllReviewsAdmin
};
