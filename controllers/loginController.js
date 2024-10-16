const loginService = require("../services/loginServices");

function isLoggedIn(req, res, next) {
  if (req.session.username != null) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function personalArea(req, res) {
  res.render("personalArea", { username: req.session.username });
}

function loginForm(req, res) {
  res.render("login", {});
}

function registerForm(req, res) {
  res.render("register", {});
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
    const { username, password } = req.body;

    try {
      await loginService.register(username, password);
      req.session.username = username;
      res.redirect('/');
    } 
    catch (error) {
      res.redirect('/register?error=1');
    }
  }

module.exports = { 
    isLoggedIn, 
    personalArea, 
    loginForm, 
    registerForm, 
    logout,
    login,
    register
};