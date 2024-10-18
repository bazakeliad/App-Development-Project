const express = require("express")
const router = express.Router()


const jerseysController = require("../controllers/jerseysController")
const generalPagesController = require("../controllers/generalPagesController")

router.route('/jerseys/team/:teamPrefix').get(jerseysController.apiGetJerseysByPrefix)
router.route('/jerseys').get(jerseysController.apiGetAllJerseys)
router.route('/news').get(generalPagesController.getAllNews)


module.exports = router