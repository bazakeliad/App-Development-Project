// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
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

module.exports = router;
