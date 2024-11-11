const loginService = require("../services/loginServices");
const userServices = require("../services/userServices");
const teamService = require('../services/teamServices');
const jerseysService = require('../services/jerseysServices');
const emailService = require('../services/emailServices');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;


// Check if the user is logged in
async function isLoggedIn(req, res, next) {
  if (req.session.username != null) {
    return next();
  } 
  else {

    // Fetch featured jerseys from the database
    const allFeaturedJerseys = await jerseysService.getFeaturedJerseys();

    // Limit the number of jerseys to display (e.g., 4 jerseys)
    const featuredJerseys = allFeaturedJerseys.slice(0, 4);

    res.status(401);
    res.render('notLoggedIn', { 
      featuredJerseys,
      title: 'A member only feature', 
      message: 'You need to log in to access this page.',
      actionUrl: '/login',
      actionText: 'Log in'
    });
  }
}

async function isLoggedAsAdmin(req, res, next) {
  if (req.session.username != null) {
    try {
      // Assuming req.session.username is the user ID
      const isAdmin = await userServices.isLoggedAsAdmin(req.session.username);

      // Fetch featured jerseys from the database
      const allFeaturedJerseys = await jerseysService.getFeaturedJerseys();

      // Limit the number of jerseys to display (e.g., 4 jerseys)
      const featuredJerseys = allFeaturedJerseys.slice(0, 4);

      if (isAdmin) {
        return next();
      } 
      else {
        res.status(403);
        res.render('restrictedPage', { 
          featuredJerseys,
          title: 'Restricted Access', 
          message: 'You do not have the required permissions to access this page.',
          actionUrl: '/', // Redirect to homepage or any other appropriate page
          actionText: 'Go to Home'
        });
      }
    } 
    catch (error) {
      console.error('Error checking admin status:', error);
      res.status(500).send('Internal server error');
    }
  } 
  else {
      // Execute the isLoggedIn function if the user is not logged in
      return isLoggedIn(req, res, next);
  }
}


async function personalArea(req, res) {
  // Check if the logged-in user is an admin
  let isAdmin = false
  if (req.session.username) {
      try {
          isAdmin = await userServices.isLoggedAsAdmin(req.session.username);
      } 
      catch (error) {
        console.error('Error checking admin status:', error);
      }
  }
  res.render("personalArea", { username: req.session.username, isAdmin });
}

async function loginForm(req, res) {
  try {
    const teams = await teamService.getAllTeams(); // Fetch the teams
    res.render("login", { teams }); 
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).send('Internal server error');
  }
}

// Log out and destroy the session
function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}

async function login(req, res) {
    const { username, password } = req.body;

    const result = await loginService.login(username, password);
    if (result) {
      req.session.username = username;
      res.redirect('/');
    } else {
      res.redirect('/login?error=1');
    }
}

async function register(req, res) {
  const { name, username, password, email, team } = req.body;
  try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      await loginService.register(name, username, hashedPassword, email, team);

      // Set the session's username cookie
      req.session.username = username;

      // Send the welcome email
      await emailService.sendWelcomeEmail(email, name);

      res.redirect('/');
  } catch (error) {
      console.error('Error during registration:', error); // Log the error for debugging
      res.redirect('/login?error=2');
  }
}

module.exports = { 
    isLoggedIn, 
    isLoggedAsAdmin, 
    personalArea, 
    loginForm, 
    logout,
    login,
    register
};