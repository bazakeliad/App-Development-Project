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

// CRUD Operations
router.get('/jerseys', adminController.getAllJerseysAdmin);          // Read all jerseys
router.get('/jerseys/add', adminController.getAddJerseyForm);        // Form to add jersey
router.post('/jerseys/add', upload.single('image'), adminController.addJersey); // Create jersey with file upload
router.get('/jerseys/edit/:id', adminController.getEditJerseyForm);  // Form to edit jersey
router.post('/jerseys/edit/:id', upload.single('image'), adminController.editJersey); // Update jersey with file upload
router.post('/jerseys/delete/:id', adminController.deleteJersey);    // Delete jersey

// Serve jersey image
router.get('/jerseys/image/:id', adminController.getJerseyImage);

module.exports = router;
