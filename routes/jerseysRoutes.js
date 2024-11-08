const express = require("express");
const router = express.Router();

// Multer for image uploads
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Import controllers
const jerseyController = require("../controllers/jerseysController");
const loginController = require("../controllers/loginController");

// Jerseys paths
router.route("/browse").get(jerseyController.getAllJerseys)
router.get('/', loginController.isLoggedAsAdmin, jerseyController.getAllJerseysAdmin);
router.get('/add', loginController.isLoggedAsAdmin, jerseyController.getAddJerseyForm);
router.post('/add', loginController.isLoggedAsAdmin, upload.single('image'), jerseyController.addJersey); 
router.get('/edit/:id', loginController.isLoggedAsAdmin, jerseyController.getEditJerseyForm);
router.post('/edit/:id', loginController.isLoggedAsAdmin, upload.single('image'), jerseyController.editJersey); 
router.get('/image/:id', jerseyController.getJerseyImage);
router.route("/:id").get(jerseyController.getJerseyById)
router.route("/:id").delete(loginController.isLoggedAsAdmin, jerseyController.deleteJerseyById)

module.exports = router
