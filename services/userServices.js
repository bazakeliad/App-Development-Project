const User = require('../models/user'); 

async function isLoggedAsAdmin(userId) {
    try {
      // Find the user by their ID
      const user = await User.findById(userId);
      
      // Check if user exists and if they are an admin
      if (user && user.is_admin) {
        return true;
      }
      return false;
    } 
    catch (error) {
      console.error('Error checking if user is admin:', error);
      throw new Error('Failed to check user admin status');
    }
  }
  
// Fetch user details by username (used for session checks)
const getUserByUsername = async (username) => {
  return await User.findOne({ _id: username });
};

// Get all users
async function getAllUsers() {
  try {
      return await User.find();
  } catch (error) {
      throw new Error('Failed to retrieve users');
  }
}

// Delete a user by ID
async function deleteUser(id) {
  try {
      return await User.findByIdAndDelete(id);
  } catch (error) {
      throw new Error('Failed to delete user');
  }
}

// Get user by ID
async function getUserById(id) {
  try {
      return await User.findById(id);
  } catch (error) {
      throw new Error('Failed to retrieve user');
  }
}

// Update user by ID
async function updateUser(id, updateData) {
  try {
      return await User.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
      throw new Error('Failed to update user');
  }
}

module.exports = {
  isLoggedAsAdmin,
  getUserByUsername,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser
};