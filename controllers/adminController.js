// controllers/adminController.js

const jerseysServices = require('../services/jerseysServices');
const multer = require('multer');

// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Order = require('../models/order');

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

        // Render the dashboard with the calculated data
        res.render('adminDashboards.ejs', {
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalJerseys,
            latestOrders
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
        res.render('adminConsole.ejs', { title: 'Admin Console' }); // Render the admin console page
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
    const { team, kitType, price, sizes } = req.body;
    const imageFile = req.file;

    // Process sizes input
    const sizesArray = sizes ? sizes.split(',').map(size => size.trim()) : [];

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

// Handle editing a jersey
const editJersey = async (req, res) => {
    const id = req.params.id;
    const { team, kitType, price, sizes } = req.body;
    const imageFile = req.file;

    // Process sizes input
    const sizesArray = sizes ? sizes.split(',').map(size => size.trim()) : [];

    const updateData = {
        team,
        kitType,
        price: parseFloat(price),
        sizes: sizesArray,
    };

    // If a new image is uploaded, include it in the update
    if (imageFile) {
        updateData.image = {
            data: imageFile.buffer,
            contentType: imageFile.mimetype
        };
    }

    try {
        const jersey = await jerseysServices.updateJerseyById(id, updateData);
        if (!jersey) {
            return res.status(404).send('Jersey not found');
        }
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
