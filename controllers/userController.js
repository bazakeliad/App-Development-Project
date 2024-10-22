const userService = require('../services/userServices'); // Adjust the path as necessary

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.render('adminUsers', { users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await userService.deleteUser(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID and update user (for future edit functionality)
exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.render('editUser', { user }); // Create a separate `editUser.ejs` file
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, team, is_admin } = req.body;  // Match with model fields

    try {
        const updateData = {
            name,           // Name of the user
            email,          // Email of the user
            team,           // Team (can be null or empty string if not filled)
            is_admin: is_admin === 'true'  // Convert the is_admin value to boolean
        };

        const updatedUser = await userService.updateUser(id, updateData);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.redirect('/admin/users'); // Redirect back to the users page
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
