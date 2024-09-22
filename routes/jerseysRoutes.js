

const express = require("express");
const router = express.Router();

const jerseysController = require("../controllers/jerseysController");

// Jerseys paths
router.get("/getAllJerseys", jerseysController.getAllJerseys);
router.get("/getJersey", jerseysController.getJerseyById);
router.get("/deleteJersey", jerseysController.deleteJerseyById);

// Route to serve jersey images
router.get("/jerseys/image/:id", jerseysController.getJerseyImage);

module.exports = router;
