// Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS

// Initialize the app
const app = express();
const port = 3000;

// Enable CORS for all origins (you can restrict it for production)
app.use(cors()); // Enable CORS for all requests

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// POST endpoint to handle form submission
app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;

    // Create a transporter object using Gmail's SMTP service
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jkcuevas4@gmail.com', // Your Gmail address
            pass: 'smjt rpvs kvzz xosi'  // Your App Password
        },
        tls: {
            rejectUnauthorized: false // Disable SSL/TLS certificate verification
        }
    });

    // Setup email data
    const mailOptions = {
        from: email, // From the email address submitted in the form
        to: 'jkcuevas4@gmail.com', // Your email address to receive the contact form
        subject: `Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Send the email using nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);  // Add logging
            return res.status(500).send({ success: false, message: 'Failed to send message' });
        }
        res.status(200).send({ success: true, message: 'Message sent successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});