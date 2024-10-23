const express = require("express")
const router = express.Router()

const loginController = require("../controllers/loginController");
const ordersController = require('../controllers/ordersController');


router.get('/personalArea', loginController.isLoggedIn, loginController.personalArea);
router.get('/personalArea/orders', loginController.isLoggedIn, ordersController.getOrdersByUser);
//router.get('/personalArea/profile', loginController.isLoggedIn, loginController.);

module.exports = router