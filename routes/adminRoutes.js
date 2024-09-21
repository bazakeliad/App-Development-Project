// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// const isAdmin = require('../middleware/isAdmin'); // Uncomment if you have isAdmin middleware

// Apply isAdmin middleware to all admin routes (if using authentication)
// router.use(isAdmin);

// CRUD Operations
router.get('/jerseys', adminController.getAllJerseysAdmin);          // Read all jerseys
router.get('/jerseys/add', adminController.getAddJerseyForm);        // Form to add jersey
router.post('/jerseys/add', adminController.addJersey);              // Create jersey
router.get('/jerseys/edit/:id', adminController.getEditJerseyForm);  // Form to edit jersey
router.post('/jerseys/edit/:id', adminController.editJersey);        // Update jersey
router.post('/jerseys/delete/:id', adminController.deleteJersey);    // Delete jersey

module.exports = router;
