const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const reviewController  = require('../controllers/reviewController');
const userController  = require('../controllers/userController');
const orderController = require('../controllers/ordersController');

const multer = require('multer');

// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const isAdmin = require('../middleware/isAdmin'); // Uncomment if you have isAdmin middleware

// Apply isAdmin middleware to all admin routes (if using authentication)
// router.use(isAdmin);

// importing login controller for protecting admin routes
const loginController = require("../controllers/loginController");

// CRUD Operations
router.get('/console', loginController.isLoggedAsAdmin, adminController.getAdminConsole);
router.get('/jerseys', loginController.isLoggedAsAdmin, adminController.getAllJerseysAdmin);          // Read all jerseys
router.get('/jerseys/add', loginController.isLoggedAsAdmin, adminController.getAddJerseyForm);        // Form to add jersey
router.post('/jerseys/add', loginController.isLoggedAsAdmin, upload.single('image'), adminController.addJersey); // Create jersey with file upload
router.get('/jerseys/edit/:id', loginController.isLoggedAsAdmin, adminController.getEditJerseyForm);  // Form to edit jersey
router.post('/jerseys/edit/:id', loginController.isLoggedAsAdmin, upload.single('image'), adminController.editJersey); // Update jersey with file upload

// Serve jersey image
router.get('/jerseys/image/:id', loginController.isLoggedAsAdmin, adminController.getJerseyImage);

// Orders
router.get('/orders', loginController.isLoggedAsAdmin, adminController.getAllOrdersAdmin);  // New route to view all orders
router.post('/orders/updateStatus/:id', loginController.isLoggedAsAdmin, orderController.updateOrderStatus);

router.get('/dashboard', loginController.isLoggedAsAdmin, adminController.getDashboard);

router.get('/reviews', loginController.isLoggedAsAdmin, adminController.getAllReviewsAdmin);

router.delete('/reviews/:id', loginController.isLoggedAsAdmin, reviewController.deleteReview); // Review delete route
// Fetch the review to edit
router.get('/reviews/edit/:id', loginController.isLoggedAsAdmin, reviewController.getReviewById);

// Handle review update (should be POST or PUT)
router.post('/reviews/edit/:id', loginController.isLoggedAsAdmin, reviewController.updateReview);



router.get('/users', loginController.isLoggedAsAdmin, userController.getAllUsers);
router.delete('/users/:id', loginController.isLoggedAsAdmin, userController.deleteUser);
router.get('/users/edit/:id', loginController.isLoggedAsAdmin, userController.getUserById);
router.post('/users/edit/:id', loginController.isLoggedAsAdmin, userController.updateUser);

module.exports = router;
