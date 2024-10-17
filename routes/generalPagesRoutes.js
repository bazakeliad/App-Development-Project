const express = require("express")
const router = express.Router()

const generalPagesController = require("../controllers/generalPagesController")

// generalPages paths, like homePage, login, etc...
router.route("/").get(generalPagesController.getHomePage)
router.route("/submit").post(generalPagesController.handleFormSubmission)
router.route("/aboutus").get(generalPagesController.getAboutUs)
router.route("/login").get(generalPagesController.login)
router.get('/myteam', generalPagesController.getTeamSelection);
router.post('/myteam', generalPagesController.postTeamSelection);
router.get('/myteam/:twitterHandle', generalPagesController.getTeamTweets);
router.get('/cart', generalPagesController.getCartPage)


// login routes
const loginController = require("../controllers/loginController");

router.route("/register")
    .get(loginController.registerForm)
    .post(loginController.register)

router.route("/login")
    .get(loginController.loginForm)
    .post(loginController.login) 

router.get("/logout", loginController.logout);
router.get('/personalArea', loginController.isLoggedIn, loginController.personalArea);


module.exports = router