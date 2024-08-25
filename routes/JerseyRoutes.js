// routes/jerseyRoutes.js
const express = require('express');
const JerseyController = require('../controllers/jerseyController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jerseys
 *   description: Jersey management
 */

/**
 * @swagger
 * /jerseys:
 *   get:
 *     summary: Get all jerseys
 *     tags: [Jerseys]
 *     responses:
 *       200:
 *         description: List of all jerseys
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   team:
 *                     type: string
 *                   price:
 *                     type: number
 *                   size:
 *                     type: string
 *                   stock:
 *                     type: integer
 *                   description:
 *                     type: string
 */
router.get('/', (req, res) => {
    const db = req.app.locals.db;
    const jerseyController = new JerseyController(db);
    jerseyController.getAll(req, res);
});

/**
 * @swagger
 * /jerseys:
 *   post:
 *     summary: Create a new jersey
 *     tags: [Jerseys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               team:
 *                 type: string
 *               price:
 *                 type: number
 *               size:
 *                 type: string
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: The jersey was created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', (req, res) => {
    const db = req.app.locals.db;
    const jerseyController = new JerseyController(db);
    jerseyController.create(req, res);
});

/**
 * @swagger
 * /jerseys/{id}:
 *   get:
 *     summary: Get a jersey by ID
 *     tags: [Jerseys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The jersey ID
 *     responses:
 *       200:
 *         description: The jersey information
 *       404:
 *         description: Jersey not found
 */
router.get('/:id', (req, res) => {
    const db = req.app.locals.db;
    const jerseyController = new JerseyController(db);
    jerseyController.getById(req, res);
});

/**
 * @swagger
 * /jerseys/{id}:
 *   put:
 *     summary: Update a jersey by ID
 *     tags: [Jerseys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The jersey ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               team:
 *                 type: string
 *               price:
 *                 type: number
 *               size:
 *                 type: string
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The jersey was updated successfully
 *       404:
 *         description: Jersey not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', (req, res) => {
    const db = req.app.locals.db;
    const jerseyController = new JerseyController(db);
    jerseyController.update(req, res);
});

/**
 * @swagger
 * /jerseys/{id}:
 *   delete:
 *     summary: Delete a jersey by ID
 *     tags: [Jerseys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The jersey ID
 *     responses:
 *       200:
 *         description: The jersey was deleted successfully
 *       404:
 *         description: Jersey not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', (req, res) => {
    const db = req.app.locals.db;
    const jerseyController = new JerseyController(db);
    jerseyController.delete(req, res);
});

module.exports = (db) => router;
