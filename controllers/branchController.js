const branchService = require('../services/branchServices');

// Get all branches
exports.getAllBranches = async (req, res) => {
    try {
        const branches = await branchService.getAllBranches();
        res.status(200).json(branches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new branch
exports.createBranch = async (req, res) => {
    const { name, address, coordinates, hours } = req.body; // Include hours
    try {
        const branch = await branchService.createBranch({ name, address, coordinates, hours });
        res.status(201).json(branch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a branch by ID
exports.getBranchById = async (req, res) => {
    try {
        const branch = await branchService.getBranchById(req.params.id);
        if (!branch) return res.status(404).json({ message: 'Branch not found' });
        res.status(200).json(branch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a branch by ID
exports.updateBranch = async (req, res) => {
    try {
        const branch = await branchService.updateBranch(req.params.id, req.body);
        if (!branch) return res.status(404).json({ message: 'Branch not found' });
        res.status(200).json(branch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a branch by ID
exports.deleteBranch = async (req, res) => {
    try {
        const branch = await branchService.deleteBranch(req.params.id);
        if (!branch) return res.status(404).json({ message: 'Branch not found' });
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
