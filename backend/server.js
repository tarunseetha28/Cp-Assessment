require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', // React's default port
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Email transporter setup
console.log('Email configuration check:');
console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);
console.log('EMAIL_USER length:', process.env.EMAIL_USER?.length);
console.log('EMAIL_PASSWORD length:', process.env.EMAIL_PASSWORD?.length);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true // Enable debug logging
});

// Verify email configuration on server start
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email configuration error:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

app.post('/api/submit-form', async (req, res) => {
  try {
    const formData = req.body;
    console.log('Received form data:', formData);

    // Validate required fields
    const requiredFields = ['name', 'email', 'contact', 'childAge', 'childGender'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: `Missing fields: ${missingFields.join(', ')}`
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        details: 'Please provide a valid email address'
      });
    }

    // Validate WhatsApp number format
    const cleanNumber = formData.contact.replace(/\D/g, '');
    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
      return res.status(400).json({
        error: 'Invalid WhatsApp number',
        details: 'Please provide a valid WhatsApp number with country code'
      });
    }

    // Prepare data for Google Sheets
    const values = [
      [
        new Date().toISOString(),
        formData.name,
        formData.email,
        formData.contact,

        formData.childAge,
        formData.childGender,
        // Add all question responses
        ...Object.entries(formData)
          .filter(([key]) => key.startsWith('step'))
          .sort(([a], [b]) => {
            const numA = parseInt(a.replace('step', ''));
            const numB = parseInt(b.replace('step', ''));
            return numA - numB;
          })
          .map(([_, value]) => value || '') // Handle undefined values
      ],
    ];

    // Append data to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A:P',
      valueInputOption: 'RAW',
      resource: { values },
    });

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: 'Assessment Form Submission Confirmation',
      html: `
        <h2>Thank you for submitting the assessment form!</h2>
        <p>We have received your submission and will review it shortly.</p>
        <h3>Submission Details:</h3>
        <ul>
          <li>Child's Age: ${formData.childAge}</li>
          <li>Child's Gender: ${formData.childGender}</li>
        </ul>
        <p>We will contact you at ${formData.email} or WhatsApp: ${formData.contact} if we need any additional information.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: 'Form submitted successfully',
      details: 'Your assessment has been recorded and a confirmation email has been sent.'
    });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: 'Failed to submit form',
      details: error.message || 'An unexpected error occurred'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
  } else {
    console.error('Error starting server:', err);
  }
}); 