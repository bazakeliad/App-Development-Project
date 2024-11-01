const express = require("express");
const router = express.Router();

// Multer for image uploads
const multer = require('multer');

// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Import controllers
const jerseyController = require("../controllers/jerseysController");
const adminController = require("../controllers/adminController");
const loginController = require("../controllers/loginController");

// Jerseys paths
router.route("/browse").get(jerseyController.getAllJerseys)
router.get('/', loginController.isLoggedAsAdmin, adminController.getAllJerseysAdmin);
router.get('/add', loginController.isLoggedAsAdmin, adminController.getAddJerseyForm);
router.post('/add', loginController.isLoggedAsAdmin, upload.single('image'), adminController.addJersey); 
router.get('/edit/:id', loginController.isLoggedAsAdmin, adminController.getEditJerseyForm);
router.post('/edit/:id', loginController.isLoggedAsAdmin, upload.single('image'), adminController.editJersey); 
router.get('/image/:id', jerseyController.getJerseyImage);
router.route("/:id").get(jerseyController.getJerseyById)
router.route("/:id").delete( loginController.isLoggedAsAdmin, jerseyController.deleteJerseyById)

module.exports = router
