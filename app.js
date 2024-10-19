// app.js

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
server.use(session({
    secret: 'bestSiteEver',
    saveUninitialized: false,
    resave: false
}));

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

// Expose myTeam routes
const myteamRoutes = require("./routes/myteamRoutes");
server.use(myteamRoutes);

// expose jerseys routes
const jerseysRoutes = require("./routes/jerseysRoutes")
server.use("/jerseys", jerseysRoutes)

// Expose admin routes
const adminRoutes = require("./routes/adminRoutes");
server.use('/admin', adminRoutes);

// expose apis path
const apis = require('./routes/apisRoutes')
server.use("/apis", apis)

// Expose order routes
const ordersRoutes = require("./routes/ordersRoutes");
server.use('/orders', ordersRoutes);

// Expose cart routes
const cartRoutes = require('./routes/cartRoutes');
server.use('/cart', cartRoutes);

// Start the server
server.listen(80, () => {
    console.log("Server is running on port 80");
});
