// File: utils/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create the transporter with credentials from .env file
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (options) => {
    try {
        // Define email options
        const mailOptions = {
            from: process.env.EMAIL_FROM, // Using the clean 'from' address
            to: options.to,
            subject: options.subject,
            html: options.html,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        return true;

    } catch (error) {
        // Log the error but do not throw so that callers can choose to proceed.
        console.error('Error sending email (non-fatal):', error);
        return false;
    }
};

module.exports = { sendEmail }; // Exporting the function