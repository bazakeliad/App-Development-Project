const express = require('express');
const router = express.Router();

// Import controllers
const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController');

// Users routes
router.get('/', loginController.isLoggedAsAdmin, userController.getAllUsers);
router.delete('/:id', loginController.isLoggedAsAdmin, userController.deleteUser);
router.get('/edit/:id', loginController.isLoggedAsAdmin, userController.getUserById);
router.post('/edit/:id', loginController.isLoggedAsAdmin, userController.updateUser);

module.exports = router;
