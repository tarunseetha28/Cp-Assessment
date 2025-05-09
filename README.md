# CP Assessment Form

A multi-step form application with Google Sheets integration and email notifications.

## Features

- 8-step form with radio button options
- Final step for collecting user information
- Google Sheets integration for storing submissions
- Email notifications using EmailJS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure EmailJS:
   - Sign up for an EmailJS account at https://www.emailjs.com/
   - Create an email template
   - Replace the following in `src/App.js`:
     - `YOUR_SERVICE_ID`
     - `YOUR_TEMPLATE_ID`
     - `YOUR_USER_ID`

3. Configure Google Sheets API:
   - Create a Google Cloud Project
   - Enable Google Sheets API
   - Create credentials (OAuth 2.0 Client ID)
   - Add the necessary code to handle Google Sheets integration

4. Start the development server:
```bash
npm start
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_USER_ID=your_user_id
```

## Technologies Used

- React
- Material-UI
- EmailJS
- Google Sheets API 