const loginService = require("../services/loginServices");
const userServices = require("../services/userServices");
const teamService = require('../services/teamServices');

function isLoggedIn(req, res, next) {
  if (req.session.username != null) {
    return next();
  } 
  else {
    res.status(401).send('Authentication required. Please <a href="/login">log in</a>.');
  }
}

async function isLoggedAsAdmin(req, res, next) {
  if (req.session.username != null) {
    try {
      // Assuming req.session.username is the user ID
      const isAdmin = await userServices.isLoggedAsAdmin(req.session.username);

      if (isAdmin) {
        return next();
      } 
      else {
        res.status(403).send('Access denied. Admins only. <a href="/">Return to Home</a>.');
      }
    } 
    catch (error) {
      console.error('Error checking admin status:', error);
      res.status(500).send('Internal server error');
    }
  } 
  else {
    res.status(401).send('Authentication required. Please <a href="/login">log in</a>.');
  }
}


function personalArea(req, res) {
  res.render("personalArea", { username: req.session.username });
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
      await loginService.register(name, username, password, email, team);

      // Set the session's username cookie
      req.session.username = username;
      res.redirect('/');
    } 
    catch (error) {
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