const Branch = require('../models/branch'); // Adjust path as necessary

// Get all branches
exports.getAllBranches = async () => {
    return await Branch.find();
};

// Create a new branch
exports.createBranch = async (branchData) => {
    const branch = new Branch(branchData);
    return await branch.save();
};

// Get a branch by ID
exports.getBranchById = async (id) => {
    return await Branch.findById(id);
};

// Update a branch by ID
exports.updateBranch = async (id, branchData) => {
    return await Branch.findByIdAndUpdate(id, branchData, { new: true, runValidators: true });
};

// Delete a branch by ID
exports.deleteBranch = async (id) => {
    return await Branch.findByIdAndDelete(id);
};

