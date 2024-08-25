// swaggerDefinition.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Jersey Store API',
            version: '1.0.0',
            description: 'API documentation for the online jersey store',
        },
        servers: [
            {
                url: 'http://localhost:3000', // Update with your server URL
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
