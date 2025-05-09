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
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

app.post('/api/submit-form', async (req, res) => {
  try {
    const formData = req.body;
    console.log('Received form data:', formData);

    // Prepare data for Google Sheets
    const values = [
      [
        new Date().toISOString(),
        formData.name,
        formData.email,
        formData.contact,
        formData.childName || '', // New field
        formData.childAge || '',  // New field
        formData.childGender || '', // New field
        formData.step1,
        formData.step2,
        formData.step3,
        formData.step4,
        formData.step5,
        formData.step6,
        formData.step7,
        formData.step8,
        formData.step9
      ],
    ];

    // Append data to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A:P', // Updated range to include new columns
      valueInputOption: 'RAW',
      resource: { values },
    });

    console.log('Form submission received:', {
      timestamp: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      childInfo: {
        name: formData.childName,
        age: formData.childAge,
        gender: formData.childGender
      },
      responses: {
        step1: formData.step1,
        step2: formData.step2,
        step3: formData.step3,
        step4: formData.step4,
        step5: formData.step5,
        step6: formData.step6,
        step7: formData.step7,
        step8: formData.step8,
        step9: formData.step9
      }
    });

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: 'Failed to submit form',
      details: error.message 
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