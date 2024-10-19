const express = require("express")
const router = express.Router()

const teamController = require("../controllers/teamController")

// My Team routes
router.get('/myteam', teamController.getTeamSelection);
router.post('/myteam', teamController.postTeamSelection);
router.get('/myteam/:twitterHandle', teamController.getTeamTweets);

module.exports = router