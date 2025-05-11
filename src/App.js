import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AssessmentForm from './components/AssessmentForm';
import ThankYou from './components/ThankYou';
import AssessmentPage from './components/AssessmentPage';
import AssessmentResult from './components/AssessmentResult';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/assessment-info" element={<AssessmentPage />} />
        <Route path="/assessment" element={<AssessmentForm />} />
        <Route path="/result" element={<AssessmentResult />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </Router>
  );
}

export default App; 