// app.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerDefinition');

const jerseyRoutes = require('./routes/jerseyRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to MongoDB and set db in app.locals
connectDB().then((db) => {
    app.locals.db = db; // Store db instance in app.locals

    // Pass db to routes
    app.use('/jerseys', jerseyRoutes(db));
    app.use('/carts', cartRoutes(db));
    app.use('/users', userRoutes(db));
    app.use('/orders', orderRoutes(db));

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
    });
}).catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
});
