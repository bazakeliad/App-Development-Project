const express = require("express")
const router = express.Router()
const teamController = require('../controllers/teamController');
const loginController = require('../controllers/loginController');

// My Team routes
router.get('/myteam', loginController.isLoggedIn, teamController.getTeamSelection);
router.get('/myteam/:twitterHandle', loginController.isLoggedIn, teamController.getTeamTweets);

module.exports = router