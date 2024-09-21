const express = require("express")
const router = express.Router()

const jerseysController = require("../controllers/jerseysController")

// jerseys paths
router.route("/getAllJerseys").get(jerseysController.getAllJerseys)
router.route("/getJersey").get(jerseysController.getJerseyById)
router.route("/deleteJersey").get(jerseysController.deleteJerseyById)


module.exports = router