const jerseysServices = require('../services/jerseysServices');
const Order = require('../models/order');
const reviewService = require('../services/reviewServices');

// Dashboard: View statistics and latest orders
const getDashboard = async (req, res) => {
    try {
        
        // Get total orders, total revenue, and total jerseys
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalJerseys = await jerseysServices.getJerseyCount();

        // Fetch latest orders
        const latestOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

        // Orders by Month: Group by year and month and count orders
        const ordersByMonth = await Order.aggregate([
            {
                $group: {
                    _id: { 
                        year: { $year: { $toDate: "$createdAt" } },
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
                        year: { $year: { $toDate: "$createdAt" } },
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

// Display admin console
const getAdminConsole = (req, res) => {
    try {
        res.render('adminConsole.ejs');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getAdminConsole,
    getDashboard,
};
