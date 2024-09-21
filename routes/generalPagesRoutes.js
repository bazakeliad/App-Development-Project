const express = require("express")
const router = express.Router()

const generalPagesController = require("../controllers/generalPagesController")

// generalPages paths, like homePage, login, etc...
router.route("/").get(generalPagesController.getHomePage)
router.route("/submit").post(generalPagesController.handleFormSubmission)
router.route("/aboutus").get(generalPagesController.getAboutUs)

module.exports = router