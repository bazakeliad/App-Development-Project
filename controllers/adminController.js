const jerseysServices = require('../services/jerseysServices');
const multer = require('multer');
const Order = require('../models/order');
const Jersey = require('../models/jersey');  // Import the Jersey model

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
            orderStatusDistribution: orderStatusDistributionData
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

// Handle adding a new jersey
const addJersey = async (req, res) => {
    const { team, kitType, price, allSizes } = req.body;
    const imageFile = req.file;

    // Check if allSizes is undefined or empty
    if (!allSizes || (Array.isArray(allSizes) && allSizes.length === 0)) {
        res.redirect('/admin/jerseys/add?error=1');
    }

    else {
        // Process sizes input
        const sizesArray = Array.isArray(allSizes) ? allSizes : [allSizes];

        const jerseyData = {
            team,
            kitType,
            price: parseFloat(price),
            sizes: sizesArray,
            image: {
                data: imageFile.buffer,
                contentType: imageFile.mimetype
            }
        };

        try {
            await jerseysServices.createJersey(jerseyData);
            res.redirect('/admin/jerseys');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
};

// Display form to edit a jersey
const getEditJerseyForm = async (req, res) => {
    const id = req.params.id;
    try {
        const jersey = await jerseysServices.getJerseyById(id);
        if (!jersey) {
            return res.status(404).send('Jersey not found');
        }
        res.render('editJersey.ejs', { jersey, title: 'Edit Jersey' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const editJersey = async (req, res) => {
    const id = req.params.id;
    const { team, kitType, price, category, description } = req.body;
    const sizesArray = req.body.allSizes || [];  // If no sizes are selected, default to an empty array
    const imageFile = req.file;  // Check if an image was uploaded

    const updateData = {
        team,
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
        res.redirect('/admin/jerseys');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
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

// Admin Orders: View all orders
const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId');  // Populate userId with user details if needed
        res.render('adminOrders', { orders, title: 'Manage Orders' });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Server error');
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
    getDashboard
};
