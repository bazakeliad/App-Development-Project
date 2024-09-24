const express = require("express")
const router = express.Router()

const generalPagesController = require("../controllers/generalPagesController")

// generalPages paths, like homePage, login, etc...
router.route("/").get(generalPagesController.getHomePage)
router.route("/submit").post(generalPagesController.handleFormSubmission)




// login routes
const loginController = require("../controllers/loginController");

// router.get("/register", loginController.registerForm);
// router.post("/register", loginController.register);
// router.get("/login", loginController.loginForm);
// router.post("/login", loginController.login);
// router.get("/logout", loginController.logout);
// router.get('/', loginController.isLoggedIn, loginController.personalArea);



router.route("/register")
    .get(loginController.registerForm)
    .post(loginController.register)

router.route("/login")
    .get(loginController.loginForm)
    .post(loginController.login) 

router.get("/logout", loginController.logout);
router.get('/personalArea', loginController.isLoggedIn, loginController.personalArea);

module.exports = router