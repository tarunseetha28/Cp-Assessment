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

// Questions for each step
const questions = [
  {
    question: "Does your child recognize and point to numbers when they see them? *",
    options: ["Yes, they recognize numbers up to 3", "Yes, they recognize numbers up to 10", "Yes, they recognize numbers up to 30"]
  },
  {
    question: "If you ask your child to bring you one toy or two toys, do they understand the difference?",
    options: ["Yes, they correctly bring the right amount", "Sometimes, they get close but not always correct", "No, they don't seem to understand quantity"]
  },
  {
    question: "Does your child enjoy looking at books or flashcards with numbers?",
    options: ["Yes, they recognize and engage with number visuals", "Yes, but only when prompted", "No, they don't show interest"]
  },
  {
    question: "Can your child recognize basic shapes (circle, square, triangle)?",
    options: ["Yes, they identify multiple shapes correctly", "They recognize only circles", "No, they struggle with recognizing shapes"]
  },
  {
    question: "When playing with blocks or puzzles, does your child attempt to match shapes?",
    options: ["Yes, they correctly match and place shapes", "They attempt but often need help", "No, they don't engage in shape-matching activities Clubs"]
  },
  {
    question: "Does your child show interest in patterns (like sorting toys by color or size)?",
    options: ["Yes, they actively sort and organize objects", "They sometimes sort but inconsistently", "No, they don't yet understand patterns"]
  },
  {
    question: "When you hide a toy under a cup, does your child try to find it?",
    options: ["Yes, they search and retrieve it", "They search but often pick the wrong one", "No, they don't look for the toy"]
  },
  {
    question: "Does your child show interest in cause-and-effect toys (e.g., pressing button to hear sound)?",
    options: ["Yes, they understand cause-and-effect concepts", "They engage sometimes but don't fully grasp it", "No, they don't respond to cause-and-effect toys"]
  },
  {
    question: "When given two choices, does your child pick the bigger or smaller item correctly?",
    options: ["Yes, they understand size differences", "Sometimes, but they guess occasionally", "No, they don't recognize size differences"]
  }
];

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
      // Send form data to backend
      const response = await fetch('http://localhost:3001/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Build answers string dynamically based on questions length
      let answers = `
Child's Name: ${formData.childName}
Child's Age: ${formData.childAge}
Child's Gender: ${formData.childGender}
`;
      for (let i = 1; i <= questions.length; i++) {
        if (formData[`step${i}`]) {
          answers += `\nStep ${i}: ${formData[`step${i}`]}`;
        }
      }

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

      navigate('/thank-you');
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (currentStep === 0) {
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
                onChange={handleInputChange}
                required
              >
                <MenuItem value="0-3 years">0-3 years</MenuItem>
                <MenuItem value="3-6 years">3-6 years</MenuItem>
                <MenuItem value="6-9 years">6-9 years</MenuItem>
                <MenuItem value="9-12 years">9-12 years</MenuItem>
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
    } else if (currentStep <= 9) {
      return (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <img src="/assets/avatar.png" alt="Avatar" />
            </Box>
            <MessageBox>
              {questions[currentStep - 1].question}
            </MessageBox>
          </Box>
          <FormControl component="fieldset" sx={{ mt: 3, width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <RadioGroup
                value={formData[`step${currentStep}`]}
                onChange={(e) => handleRadioChange(`step${currentStep}`, e.target.value)}
              >
                {questions[currentStep - 1].options.map((option, index) => {
                  const selected = formData[`step${currentStep}`] === option;
                  return (
                    <Box
                      key={index}
                      onClick={() => handleRadioChange(`step${currentStep}`, option)}
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
                        {option}
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
                  <path d="M0.586909 8.54149L-2.10486 10.9115L-2.10485 10.9115L0.586909 8.54149ZM6.19177 14.9072L8.88353 12.5372L8.88353 12.5372L6.19177 14.9072ZM0.586909 7.12688L-2.10485 4.75685L-2.10486 4.75686L0.586909 7.12688ZM6.19177 0.761146L8.88353 3.13117L8.88353 3.13117L6.19177 0.761146ZM7.4373 2.17575L4.74553 -0.194273L7.4373 2.17575ZM3.33592 6.8339L0.644153 4.46388L-4.60036 10.4204L3.33592 10.4204L3.33592 6.8339ZM3.33592 8.83446L3.33592 5.24801L-4.60036 5.24801L0.644153 11.2045L3.33592 8.83446ZM-2.10485 10.9115L3.50001 17.2772L8.88353 12.5372L3.27867 6.17146L-2.10485 10.9115ZM-2.10486 4.75686C-3.64171 6.50234 -3.64171 9.16602 -2.10486 10.9115L3.27868 6.17147C3.74272 6.69851 3.9154 7.31195 3.9154 7.83418C3.9154 8.35641 3.74272 8.96986 3.27868 9.4969L-2.10486 4.75686ZM3.50001 -1.60888L-2.10485 4.75685L3.27867 9.49691L8.88353 3.13117L3.50001 -1.60888ZM10.1291 -1.60888C8.35708 -3.62141 5.27199 -3.62141 3.50001 -1.60888L8.88353 3.13117C8.39969 3.6807 7.65679 4.05462 6.81453 4.05462C5.97228 4.05462 5.22938 3.6807 4.74553 3.13117L10.1291 -1.60888ZM10.1291 4.54578C11.6659 2.80029 11.6659 0.136609 10.1291 -1.60888L4.74553 3.13117C4.28149 2.60413 4.1088 1.99069 4.1088 1.46845C4.1088 0.946213 4.28149 0.332765 4.74553 -0.194273L10.1291 4.54578ZM6.02768 9.20393L10.1291 4.54578L4.74553 -0.194273L0.644153 4.46388L6.02768 9.20393ZM15.6535 3.24746L3.33592 3.24746L3.33592 10.4204L15.6535 10.4204L15.6535 3.24746ZM20.1206 7.83418C20.1206 5.74361 18.536 3.24746 15.6535 3.24746L15.6535 10.4204C13.7438 10.4204 12.9477 8.81988 12.9477 7.83418L20.1206 7.83418ZM15.6535 12.4209C18.536 12.4209 20.1206 9.92476 20.1206 7.83418L12.9477 7.83418C12.9477 6.84848 13.7438 5.24801 15.6535 5.24801L15.6535 12.4209ZM3.33592 12.4209L15.6535 12.4209L15.6535 5.24801L3.33592 5.24801L3.33592 12.4209ZM10.1291 11.1226L6.02768 6.46444L0.644153 11.2045L4.74553 15.8626L10.1291 11.1226ZM10.1291 17.2772C11.6659 15.5318 11.6659 12.8681 10.1291 11.1226L4.74553 15.8626C4.28149 15.3356 4.1088 14.7222 4.1088 14.1999C4.1088 13.6777 4.28149 13.0642 4.74553 12.5372L10.1291 17.2772ZM3.50001 17.2772C5.27199 19.2898 8.35708 19.2898 10.1291 17.2772L4.74553 12.5372C5.22937 11.9877 5.97228 11.6137 6.81453 11.6137C7.65679 11.6137 8.39969 11.9877 8.88353 12.5372L3.50001 17.2772Z" fill="white" mask="url(#path-1-inside-1_2310_8228)"/>
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
                <path d="M16.0479 7.12746L18.7396 4.75744L18.7396 4.75743L16.0479 7.12746ZM10.443 0.761726L7.75123 3.13175L7.75124 3.13175L10.443 0.761726ZM16.0479 8.54207L18.7396 10.9121L18.7396 10.9121L16.0479 8.54207ZM10.443 14.9078L7.75123 12.5378L7.75123 12.5378L10.443 14.9078ZM9.19747 13.4932L11.8892 15.8632L9.19747 13.4932ZM13.2989 8.83504L15.9906 11.2051L21.2351 5.24859L13.2989 5.24859L13.2989 8.83504ZM13.2989 6.83448L13.2989 10.4209L21.2351 10.4209L15.9906 4.46446L13.2989 6.83448ZM18.7396 4.75743L13.1348 -1.6083L7.75124 3.13175L13.3561 9.49748L18.7396 4.75743ZM18.7396 10.9121C20.2765 9.1666 20.2765 6.50292 18.7396 4.75744L13.3561 9.49748C12.892 8.97044 12.7194 8.35699 12.7194 7.83476C12.7194 7.31253 12.892 6.69909 13.3561 6.17205L18.7396 10.9121ZM13.1348 17.2778L18.7396 10.9121L13.3561 6.17204L7.75123 12.5378L13.1348 17.2778ZM6.50571 17.2778C8.27769 19.2904 11.3628 19.2904 13.1348 17.2778L7.75123 12.5378C8.23508 11.9882 8.97798 11.6143 9.82023 11.6143C10.6625 11.6143 11.4054 11.9882 11.8892 12.5378L6.50571 17.2778ZM6.50571 11.1232C4.96885 12.8687 4.96885 15.5323 6.50571 17.2778L11.8892 12.5378C12.3533 13.0648 12.526 13.6783 12.526 14.2005C12.526 14.7227 12.3533 15.3362 11.8892 15.8632L6.50571 11.1232ZM10.6071 6.46501L6.50571 11.1232L11.8892 15.8632L15.9906 11.2051L10.6071 6.46501ZM0.981304 12.4215L13.2989 12.4215L13.2989 5.24859L0.981304 5.24859L0.981304 12.4215ZM-3.48586 7.83476C-3.48586 9.92534 -1.90121 12.4215 0.981304 12.4215L0.981304 5.24859C2.891 5.24859 3.68703 6.84906 3.68703 7.83476L-3.48586 7.83476ZM0.981305 3.24804C-1.9012 3.24803 -3.48586 5.74418 -3.48586 7.83476L3.68703 7.83476C3.68703 8.82046 2.891 10.4209 0.981304 10.4209L0.981305 3.24804ZM13.2989 3.24804L0.981305 3.24804L0.981304 10.4209L13.2989 10.4209L13.2989 3.24804ZM6.50571 4.54636L10.6071 9.20451L15.9906 4.46446L11.8892 -0.193693L6.50571 4.54636ZM6.50571 -1.6083C4.96885 0.137187 4.96885 2.80087 6.50571 4.54636L11.8892 -0.193693C12.3533 0.333347 12.526 0.946795 12.526 1.46903C12.526 1.99126 12.3533 2.60471 11.8892 3.13175L6.50571 -1.6083ZM13.1348 -1.6083C11.3628 -3.62083 8.27769 -3.62083 6.50571 -1.6083L11.8892 3.13175C11.4054 3.68128 10.6625 4.0552 9.82023 4.0552C8.97798 4.0552 8.23508 3.68128 7.75123 3.13175L13.1348 -1.6083Z" fill="white" mask="url(#path-1-inside-1_2310_8229)"/>
              </svg>
            </Box>
          </Box>
        </Box>
      );
    } else if (currentStep === 10) {
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
        }}
      >
        {/* Logo at the top, as in LandingPage */}
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
            {currentStep > 0 && currentStep <= questions.length && (
              <>
                <ProgressBar currentStep={currentStep} totalSteps={questions.length} />
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