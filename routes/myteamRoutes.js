const express = require("express")
const router = express.Router()

// Import controllers
const teamController = require('../controllers/teamController');
const loginController = require('../controllers/loginController');

// My Team routes
router.get('/', loginController.isLoggedIn, teamController.getTeamSelection);
router.get('/:twitterHandle', loginController.isLoggedIn, teamController.getmyteam);

module.exports = router