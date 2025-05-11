import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  TextField,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import emailjs from '@emailjs/browser';
import CheckIcon from '@mui/icons-material/Check';
import questionsByAgeGroup from '../questions_by_age_group.json';

// Initialize EmailJS
emailjs.init("wE0cUgOkzoklGEuV_");

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AssessmentForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    childGender: '',
    step1: '',
    step2: '',
    step3: '',
    step4: '',
    step5: '',
    step6: '',
    step7: '',
    step8: '',
    step9: '',
    step10: '',
    name: '',
    email: '',
    contact: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');

  const handleRadioChange = (step, value) => {
    setFormData(prev => ({
      ...prev,
      [step]: value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgeGroupChange = (e) => {
    setSelectedAgeGroup(e.target.value);
    handleInputChange(e);
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get the current questions for the selected age group
      const currentQuestions = questionsByAgeGroup[formData.childAge] || [];
      
      // Prepare form data for submission
      const submissionData = {
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        childName: formData.childName,
        childAge: formData.childAge,
        childGender: formData.childGender,
        // Add all question responses
        ...Object.fromEntries(
          Object.entries(formData)
            .filter(([key]) => key.startsWith('step'))
            .map(([key, value]) => [key, value])
        )
      };

      // Send form data to backend
      const response = await fetch('http://localhost:3001/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to submit form');
      }

      // Build answers string for email
      let answers = `
Child's Name: ${formData.childName}
Child's Age: ${formData.childAge}
Child's Gender: ${formData.childGender}
`;
      
      // Add all question responses to the email
      currentQuestions.forEach((q, index) => {
        const stepKey = `step${index + 1}`;
        if (formData[stepKey]) {
          answers += `\n${q.question}\nAnswer: ${formData[stepKey]}`;
        }
      });

      // Send email using EmailJS
      await emailjs.send(
        'service_9mg2zrn',
        'template_eahjwcl',
        {
          from_name: formData.name,
          from_email: formData.email,
          contact_number: formData.contact,
          child_name: formData.childName,
          child_age: formData.childAge,
          child_gender: formData.childGender,
          answers: answers
        }
      );

      // Clear form data and navigate to result page
      const resultFormData = { ...formData };
      setFormData({
        childName: '',
        childAge: '',
        childGender: '',
        step1: '',
        step2: '',
        step3: '',
        step4: '',
        step5: '',
        step6: '',
        step7: '',
        step8: '',
        step9: '',
        step10: '',
        name: '',
        email: '',
        contact: '',
      });
      setCurrentStep(0);
      setSelectedAgeGroup('');
      navigate('/result', { state: { formData: resultFormData } });
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const questions = questionsByAgeGroup[selectedAgeGroup] || [];

  const renderStep = () => {
    if (currentStep === 0) {
      // Always render the age group/child info form
      return (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Tell us about your child
          </Typography>
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            <TextField
              fullWidth
              label="Child's Name"
              name="childName"
              value={formData.childName}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Child's Age</InputLabel>
              <Select
                name="childAge"
                value={formData.childAge}
                onChange={handleAgeGroupChange}
                required
              >
                <MenuItem value="(0-3)">0-3 years</MenuItem>
                <MenuItem value="(3-6)">3-6 years</MenuItem>
                <MenuItem value="Age(6-9)">6-9 years</MenuItem>
                <MenuItem value="Age(9-12)">9-12 years</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Child's Gender</InputLabel>
              <Select
                name="childGender"
                value={formData.childGender}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Next
            </Button>
          </form>
        </Box>
      );
    }

    // Get questions for the selected age group
    const currentQuestions = questionsByAgeGroup[formData.childAge] || [];

    // Show the final info form after all questions
    if (currentStep === currentQuestions.length + 1) {
      return (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Final Step
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </form>
        </Box>
      );
    }

    // For question steps, guard against missing questions
    if (!currentQuestions.length || !currentQuestions[currentStep - 1]) {
      return null;
    }

    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <img src="/assets/avatar.png" alt="Avatar" />
          </Box>
          <MessageBox>
            {currentQuestions[currentStep - 1].question}
          </MessageBox>
        </Box>
        <FormControl component="fieldset" sx={{ mt: 3, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <RadioGroup
              value={formData[`step${currentStep}`]}
              onChange={(e) => handleRadioChange(`step${currentStep}`, e.target.value)}
            >
              {currentQuestions[currentStep - 1].options.map((option, index) => {
                const value = option.text;
                const selected = formData[`step${currentStep}`] === value;
                return (
                  <Box
                    key={index}
                    onClick={() => handleRadioChange(`step${currentStep}`, value)}
                    sx={{
                      mb: 2,
                      borderRadius: '15px',
                      background: selected ? 'rgba(123, 63, 169, 1)' : 'rgba(255, 255, 255, 1)',
                      boxShadow: '0px 4px 24px 0px rgba(77, 216, 243, 0.2)',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '430px',
                      height: '55px',
                      gap: '10px',
                      p: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    <Box sx={{
                      color: selected ? 'white' : 'black',
                      fontFamily: 'Gilroy-Medium, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      width: '100%',
                      textAlign: 'left',
                    }}>
                      {option.text}
                    </Box>
                    <Box
                      sx={{
                        width: '20.8px',
                        height: '20.8px',
                        borderRadius: '6.5px',
                        border: selected ? '1px solid rgba(250, 170, 21, 1)' : '1px solid rgba(0, 0, 0, 0.24)',
                        background: selected ? 'rgba(250, 170, 21, 1)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s, border 0.2s',
                      }}
                    >
                      {selected && (
                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.06641 4.87595L4.10231 7.89078L10.9331 1.10742" stroke="white" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </RadioGroup>
          </Box>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
          {currentStep > 1 && (
            <Box
              onClick={handleBack}
              sx={{
                width: '44.93px',
                height: '44.93px',
                borderRadius: '71.73px',
                border: '6.46px solid rgba(29, 29, 29, 1)',
                background: 'rgba(29, 29, 29, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="path-1-inside-1_2310_8228" fill="white">
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.19177 14.9072L0.586909 8.54149C0.242968 8.15085 0.242968 7.51751 0.586909 7.12688L6.19177 0.761146C6.53571 0.370514 7.09335 0.370514 7.4373 0.761146C7.78124 1.15178 7.78124 1.78512 7.4373 2.17575L3.33592 6.8339L15.6535 6.83391C16.1399 6.83391 16.5342 7.28174 16.5342 7.83418C16.5342 8.38662 16.1399 8.83446 15.6535 8.83446L3.33592 8.83446L7.43729 13.4926C7.78124 13.8832 7.78124 14.5166 7.43729 14.9072C7.09335 15.2979 6.53571 15.2979 6.19177 14.9072Z"/>
                </mask>
                <path fillRule="evenodd" clipRule="evenodd" d="M6.19177 14.9072L0.586909 8.54149C0.242968 8.15085 0.242968 7.51751 0.586909 7.12688L6.19177 0.761146C6.53571 0.370514 7.09335 0.370514 7.4373 0.761146C7.78124 1.15178 7.78124 1.78512 7.4373 2.17575L3.33592 6.8339L15.6535 6.83391C16.1399 6.83391 16.5342 7.28174 16.5342 7.83418C16.5342 8.38662 16.1399 8.83446 15.6535 8.83446L3.33592 8.83446L7.43729 13.4926C7.78124 13.8832 7.78124 14.5166 7.43729 14.9072C7.09335 15.2979 6.53571 15.2979 6.19177 14.9072Z" fill="white"/>
              </svg>
            </Box>
          )}
          <Box
            onClick={handleNext}
            sx={{
              width: '44.93px',
              height: '44.93px',
              borderRadius: '71.73px',
              border: '6.46px solid rgba(29, 29, 29, 1)',
              background: 'rgba(29, 29, 29, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
              opacity: !formData[`step${currentStep}`] ? 0.5 : 1,
              pointerEvents: !formData[`step${currentStep}`] ? 'none' : 'auto',
            }}
          >
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="path-1-inside-1_2310_8229" fill="white">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.443 0.761726L16.0479 7.12746C16.3918 7.51809 16.3918 8.15143 16.0479 8.54207L10.443 14.9078C10.0991 15.2984 9.54141 15.2984 9.19747 14.9078C8.85353 14.5172 8.85353 13.8838 9.19747 13.4932L13.2989 8.83504L0.981304 8.83504C0.494896 8.83504 0.100585 8.3872 0.100585 7.83476C0.100585 7.28232 0.494897 6.83448 0.981304 6.83448L13.2989 6.83448L9.19747 2.17633C8.85353 1.7857 8.85353 1.15236 9.19747 0.761726C9.54141 0.371093 10.0991 0.371093 10.443 0.761726Z"/>
              </mask>
              <path fillRule="evenodd" clipRule="evenodd" d="M10.443 0.761726L16.0479 7.12746C16.3918 7.51809 16.3918 8.15143 16.0479 8.54207L10.443 14.9078C10.0991 15.2984 9.54141 15.2984 9.19747 14.9078C8.85353 14.5172 8.85353 13.8838 9.19747 13.4932L13.2989 8.83504L0.981304 8.83504C0.494896 8.83504 0.100585 8.3872 0.100585 7.83476C0.100585 7.28232 0.494897 6.83448 0.981304 6.83448L13.2989 6.83448L9.19747 2.17633C8.85353 1.7857 8.85353 1.15236 9.19747 0.761726C9.54141 0.371093 10.0991 0.371093 10.443 0.761726Z" fill="white"/>
            </svg>
          </Box>
        </Box>
      </Box>
    );
  };

  const ProgressBar = ({ currentStep, totalSteps }) => {
    const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    return (
      <Box sx={{ position: 'relative', width: '100%', height: 24, mb: 4 }}>
        {/* Background bar */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: 12,
          background: 'rgba(241, 241, 241, 1)',
          borderRadius: 6,
          transform: 'translateY(-50%)',
          zIndex: 1,
        }} />
        {/* Filled bar */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: `${percent}%`,
          height: 12,
          background: 'rgba(130, 226, 255, 1)',
          borderRadius: 6,
          transform: 'translateY(-50%)',
          zIndex: 2,
          transition: 'width 0.3s',
        }} />
        {/* Dots */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 3,
          pointerEvents: 'none',
        }}>
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <Box
              key={idx}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxSizing: 'border-box',
                transition: 'background 0.3s, border 0.3s',
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const MessageBox = ({ children }) => (
    <Box
      sx={{
        position: 'relative',
        width: 317,
        minHeight: 134,
        height: 134,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
      }}
    >
      {/* SVG background */}
      <svg
        width="317"
        height="134"
        viewBox="0 0 317 134"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M51.8438 -0.00976562C38.5889 -0.00976562 27.8438 10.7354 27.8438 23.9902V57.3476C15.9472 63.094 6.68588 57.7306 2.47693 55.2931C-0.806012 53.3919 -1.01516 53.2708 2.99651 61.5901C8.23689 72.4575 18.1395 77.3424 27.8438 79.129V109.99C27.8438 123.245 38.5889 133.99 51.8438 133.99H292.844C306.099 133.99 316.844 123.245 316.844 109.99V23.9902C316.844 10.7354 306.099 -0.00976562 292.844 -0.00976562H51.8438Z"
          fill="#9AE8FF"
        />
      </svg>
      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'left',
          fontFamily: 'Gilroy-SemiBold, sans-serif',
          fontWeight: 600,
          fontSize: '20px',
          lineHeight: '1.2em',
          letterSpacing: '-1%',
          color: 'black',
          px: 2,
          pl: 7,
          lineHeight: 1.4,
        }}
      >
        {children}
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 4,
          background: '#fff',
        }}
      >
        {/* Logo at the top */}
        <Box sx={{ mb: 4 }}>
          <img 
            src="/assets/logo.png" 
            alt="Logo" 
            style={{ maxWidth: '200px', height: 'auto' }}
          />
        </Box>
        <Container maxWidth="sm" sx={{ background: 'none', boxShadow: 'none', p: 0 }}>
          <Box>
            {/* Progress Bar */}
            {currentStep > 0 && currentStep <= (questionsByAgeGroup[formData.childAge] || []).length && (
              <>
                <ProgressBar currentStep={currentStep} totalSteps={(questionsByAgeGroup[formData.childAge] || []).length} />
                <Box
                  sx={{
                    fontFamily: 'Gilroy-Bold, sans-serif',
                    fontWeight: 600,
                    fontSize: '20px',
                    lineHeight: '120%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: 'rgba(0, 151, 196, 1)',
                    mb: 0,
                    width: 'fit-content',
                    mx: 'auto',
                  }}
                >
                  {`${formData.childName ? formData.childName : 'Child'}'s Profile`}
                </Box>
              </>
            )}
            {renderStep()}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default AssessmentForm; 