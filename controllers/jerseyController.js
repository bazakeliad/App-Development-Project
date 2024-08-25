// controllers/jerseyController.js
const Jersey = require('../models/Jersey');

class JerseyController {
    constructor(db) {
        this.jerseyModel = new Jersey(db);
    }

    // Handle creating a new jersey
    async create(req, res) {
        try {
            const data = req.body;
            const jerseyId = await this.jerseyModel.create(data);
            res.status(201).json({ id: jerseyId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Handle fetching all jerseys
    async getAll(req, res) {
        try {
            const jerseys = await this.jerseyModel.getAll();
            res.json(jerseys);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Handle fetching a single jersey by ID
    async getById(req, res) {
        try {
            const jersey = await this.jerseyModel.getById(req.params.id);
            if (!jersey) {
                res.status(404).json({ error: 'Jersey not found' });
            } else {
                res.json(jersey);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Handle updating a jersey by ID
    async update(req, res) {
        try {
            const updatedCount = await this.jerseyModel.update(req.params.id, req.body);
            if (updatedCount === 0) {
                res.status(404).json({ error: 'Jersey not found' });
            } else {
                res.json({ message: 'Jersey updated successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Handle deleting a jersey by ID
    async delete(req, res) {
        try {
            const deletedCount = await this.jerseyModel.delete(req.params.id);
            if (deletedCount === 0) {
                res.status(404).json({ error: 'Jersey not found' });
            } else {
                res.json({ message: 'Jersey deleted successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = JerseyController;
