const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController'); // Adjust path as necessary

// Route to get all branches
router.get('/', branchController.getAllBranches);

// Route to create a new branch
router.post('/', branchController.createBranch);

// Route to get a branch by ID
router.get('/:id', branchController.getBranchById);

// Route to update a branch by ID
router.put('/:id', branchController.updateBranch);

// Route to delete a branch by ID
router.delete('/:id', branchController.deleteBranch);

module.exports = router;
