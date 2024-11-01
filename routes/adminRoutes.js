const express = require('express');
const router = express.Router();

// Import controllers
const loginController = require("../controllers/loginController");
const adminController = require('../controllers/adminController');

// Admin routes
router.get('/console', loginController.isLoggedAsAdmin, adminController.getAdminConsole);
router.get('/console/dashboard', loginController.isLoggedAsAdmin, adminController.getDashboard);

module.exports = router;
