const userService = require('../services/userServices');
const teamService = require('../services/teamServices');
const cartService = require('../services/cartServices');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.render('adminUsers', { users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {

        // Delete the user
        const deletedUser = await userService.deleteUser(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user's cart
        const deletedCart = await cartService.deleteCartByUserId(id);
        if (deletedCart) {
            console.log(`Cart for user ${id} deleted successfully`);
        } else {
            console.log(`No cart found for user ${id}`);
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user and associated cart:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID and update user
const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).redirect('/pageNotFound');
        const teams = await teamService.getAllTeams(); 
        res.render('editUser', { user, teams }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, team, is_admin } = req.body;

    try {
        const updateData = {
            name,           
            email,          
            team,
            is_admin: is_admin === 'true'
        };
        const updatedUser = await userService.updateUser(id, updateData);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.redirect(`/admin/users?message=User updated successfully&type=success`);
    } catch (error) {
        console.error('Error updating user:', error);
        res.redirect(`/admin/users?message=Error updating user&type=error`);
    }
};

// Get the profile page for the logged-in user
const getUserProfile = async (req, res) => {
    try {
        const userId = req.session.username;  
        if (!userId) {
            return res.status(401).send('Unauthorized access');
        }

        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const teams = await teamService.getAllTeams();

        res.render('profile', { user, teams });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Update user profile
const updateUserProfile = async (req, res) => {
    const { name, email, password, team } = req.body;
    const userId = req.session.username;

    try {
        const updatedData = {
            name,
            email,
            team
        };

        // If a new password is provided, hash it before updating
        if (password !== '') {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            updatedData.password = hashedPassword;
        }
        const updatedUser = await userService.updateUser(userId, updatedData);

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        // Redirect with success message in the query string
        res.redirect('/personalArea/?message=Profile updated successfully&type=success');
    } catch (error) {
        console.error('Error updating user profile:', error);
        
        // Redirect with error message in the query string
        res.redirect('/personalArea/?message=Error updating profile&type=error');
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    getUserById,
    updateUser,
    getUserProfile,
    updateUserProfile
};