const express = require("express")
const router = express.Router()


const jerseysController = require("../controllers/jerseysController")

router.route('/search/:teamPrefix').get(jerseysController.searchJerseys)

module.exports = router