const express = require("express");
const server = express();

// For parsing URL-encoded data and JSON
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// Mongoose connection
const mongoose = require('mongoose');

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost:27017/jerseysAllstarsShop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const session = require('express-session');
require('dotenv').config(); // Load environment variables
server.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}));

// Middleware to make `user` available in all views
server.use((req, res, next) => {
    res.locals.user = req.session.username || null;
    res.locals.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    next();
});

server.set("view engine", "ejs");

// Expose public directory resources
server.use(express.static("public"));

// Set the view engine to EJS
const path = require('path');
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

// Expose generalPages routes
const generalPagesRoutes = require("./routes/generalPagesRoutes");
server.use(generalPagesRoutes);

// Expose generalPages routes
const personalareaRoutes = require("./routes/personalareaRoutes");
server.use("/personalArea", personalareaRoutes);

// Expose myTeam routes
const myteamRoutes = require("./routes/myteamRoutes");
server.use("/myteam", myteamRoutes);

// expose jerseys routes
const jerseysRoutes = require("./routes/jerseysRoutes")
server.use("/jerseys", jerseysRoutes)

// Expose admin routes
const adminRoutes = require("./routes/adminRoutes");
const storeRoutes = require("./routes/storeRoutes");
const orderRoutes = require("./routes/ordersRoutes");
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
server.use('/admin', adminRoutes);
server.use("/admin/jerseys", jerseysRoutes);
server.use("/admin/stores", storeRoutes);
server.use("/admin/orders", orderRoutes);
server.use("/admin/reviews", reviewRoutes);
server.use("/admin/users", userRoutes);

// expose apis path
const apis = require('./routes/apisRoutes')
server.use("/apis", apis);

// Expose cart routes
const cartRoutes = require('./routes/cartRoutes');
server.use('/cart', cartRoutes);

// Catch-all route for 404 errors (Page Not Found)
server.use(async(req, res, next) => {
    res.status(404);
    res.redirect('/pageNotFound');
});

// Start the server
server.listen(80, () => {
    console.log("Server is running on port 80");
});
