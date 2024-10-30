const userService = require('../services/userServices'); // Adjust the path as necessary
const teamService = require('../services/teamServices');

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
        if (!user) return res.status(404).redirect('/pageNotFound');
        const teams = await teamService.getAllTeams(); 
        res.render('editUser', { user, teams }); 
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

// Get the profile page for the logged-in user
exports.getUserProfile = async (req, res) => {
    try {
        console.log('Session User ID:', req.session.username);  // Debugging
        const userId = req.session.username;  // Assume userId is stored in session when logged in
        if (!userId) {
            return res.status(401).send('Unauthorized access');
        }

        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const teams = await teamService.getAllTeams();  // Fetch the teams from the teamService

        res.render('profile', { user, teams });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Update user profile
exports.updateUserProfile = async (req, res) => {
    const { name, email, password, team } = req.body;
    const userId = req.session.username;  // Ensure only the logged-in user can update

    try {
        const updatedData = {
            name,
            email,
            password: password !== '' ? password : undefined,  // Only update if provided
            team
        };

        const updatedUser = await userService.updateUser(userId, updatedData);

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        // Redirect with success message in the query string
        res.redirect('/personalArea/profile?message=Profile updated successfully&type=success');
    } catch (error) {
        console.error('Error updating user profile:', error);
        // Redirect with error message in the query string
        res.redirect('/personalArea/profile?message=Error updating profile&type=error');
    }
};
