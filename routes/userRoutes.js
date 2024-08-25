// routes/userRoutes.js
const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: The user was registered successfully
 *       500:
 *         description: Internal server error
 */
router.post('/register', (req, res) => {
    const db = req.app.locals.db;
    const userController = new UserController(db);
    userController.register(req, res);
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user was logged in successfully
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post('/login', (req, res) => {
    const db = req.app.locals.db;
    const userController = new UserController(db);
    userController.login(req, res);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user information by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user's information
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', (req, res) => {
    const db = req.app.locals.db;
    const userController = new UserController(db);
    userController.getUser(req, res);
});

module.exports = (db) => router;
