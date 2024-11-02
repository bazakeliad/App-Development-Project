const express = require("express")
const router = express.Router()

// Import controllers
const generalPagesController = require("../controllers/generalPagesController")
const loginController = require("../controllers/loginController");

// generalPages paths, like homePage, login, etc...
router.route("/").get(generalPagesController.getHomePage)
router.route("/aboutus").get(generalPagesController.getAboutUs)
router.route("/pageNotFound").get(generalPagesController.getPageNotFound)

// login routes
router.route("/register")
    .post(loginController.register)
router.route("/login")
    .get(loginController.loginForm)
    .post(loginController.login) 
router.get("/logout", loginController.logout);


module.exports = router