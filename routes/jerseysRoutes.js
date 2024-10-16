

const express = require("express");
const router = express.Router();

const jerseysController = require("../controllers/jerseysController");

// Jerseys paths
// rest api - /articles in get, get all. in post upload new one.
router.route("/")
    .get(jerseysController.getAllJerseys)
    // .post(articleController.createJersey);

// rest api - /articles/:1 get article with id 1. in delete, delete him
router.route("/:id")
    .get(jerseysController.getJerseyById)
    .delete(jerseysController.deleteJerseyById)

// Route to serve jersey images
router.get("/image/:id", jerseysController.getJerseyImage);

module.exports = router;
