// services/emailService.js
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET =  process.env.CLIENT_SECRET;
const REDIRECT_URI =  process.env.REDIRECT_URI;
const REFRESH_TOKEN =  process.env.REFRESH_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendOrderConfirmationEmail = async (email, name, orderDetails) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: EMAIL_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        // Constructing the order summary as HTML
        const itemsList = orderDetails.items.map(item => {
            return `<li>${item.quantity} x ${item.size} ${item.team} ${item.kitType} - $${item.price}</li>`;
        }).join('');

        const mailOptions = {
            from: `"ALLSTARS JERSEYS" <${EMAIL_USER}>`,
            to: email,
            subject: 'Order Confirmation - ALLSTARS JERSEYS',
            html: `
                <h3>Thank you for your order, ${name}!</h3>
                <p>We have received your order and it is now being processed.</p>
                <h4>Order Summary:</h4>
                <ul>${itemsList}</ul>
                <p><strong>Total Price:</strong> $${orderDetails.totalPrice}</p>
                <p>Shipping Address: ${orderDetails.address}</p>
                <p>Thank you for shopping with ALLSTARS JERSEYS!</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};

const sendWelcomeEmail = async (email, name) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: EMAIL_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: '"ALLSTARS JERSEYS" <${EMAIL_USER}>',
            to: email,
            subject: 'Welcome to ALLSTARS JERSEYS!',
            text: `Hi ${name},\n\nThank you for signing up with ALLSTARS JERSEYS! We're thrilled to have you on board.\n\nBest,\nThe ALLSTARS JERSEYS Team`,
            html: `<p>Hi ${name},</p><p>Thank you for signing up with <b>ALLSTARS JERSEYS</b>! We're thrilled to have you on board.</p><p>Best,<br>The ALLSTARS JERSEYS Team</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

module.exports = { 
    sendOrderConfirmationEmail,
    sendWelcomeEmail
};
