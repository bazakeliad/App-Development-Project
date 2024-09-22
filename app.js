const express = require("express")
const server = express()

// for using post parameters
server.use(express.urlencoded({ extended: true }));



// require('custom-env').env(process.env.NODE_ENV, './config');


const mongoose = require('mongoose');

// mongoose.connect(process.env.CONNECTION_STRING,
//     {   useNewUrlParser: true,
//         useUnifiedTopology: true });
mongoose.connect('mongodb://localhost:27017/jerseysAllstarsShop',
    {   useNewUrlParser: true,
        useUnifiedTopology: true });



// expose public directory resources.
server.use(express.static("public"))


// expose generalPages routes
const generalPagesRoutes = require("./routes/generalPagesRoutes")
server.use(generalPagesRoutes)

// expose jerseys routes
const jerseysRoutes = require("./routes/jerseysRoutes")
server.use("/jerseys", jerseysRoutes)

// expose apis path
const apis = require('./routes/apisRoutes')
server.use("/apis", apis)

// server.listen(process.env.PORT)
server.listen(80)
