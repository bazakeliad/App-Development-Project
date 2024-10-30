

const express = require("express");
const router = express.Router();

const jerseysController = require("../controllers/jerseysController");

// Jerseys paths
router.route("/")
    .get(jerseysController.getAllJerseys)


const loginController = require("../controllers/loginController");

router.route("/:id")
    .get(jerseysController.getJerseyById)
    .delete(loginController.isLoggedAsAdmin, jerseysController.deleteJerseyById)

// Route to serve jersey images
router.get("/image/:id", jerseysController.getJerseyImage);

module.exports = router
