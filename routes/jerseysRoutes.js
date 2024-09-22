const express = require("express")
const router = express.Router()

const jerseysController = require("../controllers/jerseysController")

// jerseys paths
router.route("/").get(jerseysController.getAllJerseys)
router.route("/:id").get(jerseysController.getJerseyById)
router.route("/:id").delete(jerseysController.deleteJerseyById)


module.exports = router