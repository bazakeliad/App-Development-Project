const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const reviewController  = require('../controllers/reviewController');
const userController  = require('../controllers/userController');
const orderController = require('../controllers/ordersController');
const jerseyController = require('../controllers/jerseysController');

const multer = require('multer');

// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
router.get('/jerseys/image/:id', loginController.isLoggedAsAdmin, jerseyController.getJerseyImage);


const storeController = require('../controllers/storeController');

// Stores routes
router.get('/stores', loginController.isLoggedAsAdmin, storeController.getAllStores);
router.get('/stores/add', loginController.isLoggedAsAdmin, storeController.renderAddStorePage);
router.post('/stores/add', loginController.isLoggedAsAdmin, storeController.createStore);
router.get('/stores/edit/:id', loginController.isLoggedAsAdmin, storeController.renderEditStorePage);
router.post('/stores/edit/:id', loginController.isLoggedAsAdmin, storeController.updateStore);
router.delete('/stores/delete/:id', loginController.isLoggedAsAdmin, storeController.deleteStore);

// Orders
router.get('/orders', loginController.isLoggedAsAdmin, adminController.getAllOrdersAdmin);  // New route to view all orders
router.post('/orders/updateStatus/:id', loginController.isLoggedAsAdmin, orderController.updateOrderStatus);

router.get('/dashboard', loginController.isLoggedAsAdmin, adminController.getDashboard);

router.get('/reviews', loginController.isLoggedAsAdmin, adminController.getAllReviewsAdmin);
router.delete('/reviews/:id', loginController.isLoggedAsAdmin, reviewController.deleteReview); // Review delete route
router.get('/reviews/edit/:id', loginController.isLoggedAsAdmin, reviewController.getReviewById);
router.post('/reviews/edit/:id', loginController.isLoggedAsAdmin, reviewController.updateReview);

router.get('/users', loginController.isLoggedAsAdmin, userController.getAllUsers);
router.delete('/users/:id', loginController.isLoggedAsAdmin, userController.deleteUser);
router.get('/users/edit/:id', loginController.isLoggedAsAdmin, userController.getUserById);
router.post('/users/edit/:id', loginController.isLoggedAsAdmin, userController.updateUser);

module.exports = router;
