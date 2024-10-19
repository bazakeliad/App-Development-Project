const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');

// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// CRUD Operations
router.get('/jerseys', adminController.getAllJerseysAdmin);          // Read all jerseys
router.get('/jerseys/add', adminController.getAddJerseyForm);        // Form to add jersey
router.post('/jerseys/add', upload.single('image'), adminController.addJersey); // Create jersey with file upload
router.get('/jerseys/edit/:id', adminController.getEditJerseyForm);  // Form to edit jersey
router.post('/jerseys/edit/:id', upload.single('image'), adminController.editJersey); // Update jersey with file upload
router.get('/jerseys/image/:id', adminController.getJerseyImage);

// Orders
router.get('/orders', adminController.getAllOrdersAdmin);  // New route to view all orders

module.exports = router;
