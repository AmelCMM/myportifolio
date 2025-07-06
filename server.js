const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;
  
  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).send('Missing required fields');
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email address');
  }
  
  // Set up Nodemailer transporter for Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `Business Message from: ${name}`,
    text: `Name: ${name}\n\nEmail: ${email}\n\nMessage: ${message}`
  };
  
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send('Email sent successfully');
  });
});

// Test route to check if server is running
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
