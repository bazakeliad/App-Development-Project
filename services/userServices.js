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
  
  module.exports = {
    isLoggedAsAdmin,
  };