const express = require("express")
const router = express.Router()


const jerseysController = require("../controllers/jerseysController")

router.route('/jerseys/team/:teamPrefix').get(jerseysController.apiGetJerseysByPrefix)
router.route('/jerseys').get(jerseysController.apiGetAllJerseys)

module.exports = router