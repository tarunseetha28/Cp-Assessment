# CP Assessment Form

A multi-step assessment form for child education evaluation, built with React and Node.js.

## Features

- Multi-step form with progress indicator
- Child information collection
- Educational assessment questions
- Google Sheets integration for data storage
- Email notifications using EmailJS
- Responsive design with Material-UI

## Project Structure

```
cp-assessment/
├── backend/           # Node.js backend
│   ├── server.js     # Express server
│   └── package.json  # Backend dependencies
├── public/           # Static files
├── src/             # React frontend
│   ├── components/  # React components
│   └── App.js       # Main application component
└── package.json     # Frontend dependencies
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file in the backend directory
   - Add required environment variables (see .env.example)

4. Start the development servers:
   ```bash
   # Start frontend (from root directory)
   npm start

   # Start backend (from backend directory)
   cd backend
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
GOOGLE_CLIENT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY=your-private-key
SPREADSHEET_ID=your-google-sheet-id
EMAIL_USER=your-email
EMAIL_PASSWORD=your-email-password
```

## Technologies Used

- React
- Node.js
- Express
- Material-UI
- Google Sheets API
- EmailJS
- React Router 