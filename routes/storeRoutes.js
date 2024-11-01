const express = require('express');
const router = express.Router();

// Import controllers
const storeController = require('../controllers/storeController');
const loginController = require('../controllers/loginController');

// Stores routes
router.get('/', loginController.isLoggedAsAdmin, storeController.getAllStores);
router.get('/add', loginController.isLoggedAsAdmin, storeController.renderAddStorePage);
router.post('/add', loginController.isLoggedAsAdmin, storeController.createStore);
router.get('/edit/:id', loginController.isLoggedAsAdmin, storeController.renderEditStorePage);
router.post('/edit/:id', loginController.isLoggedAsAdmin, storeController.updateStore);
router.delete('/delete/:id', loginController.isLoggedAsAdmin, storeController.deleteStore);

module.exports = router;