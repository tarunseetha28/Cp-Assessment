import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Container, 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  TextField,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import emailjs from '@emailjs/browser';

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
    question: "What is your child's current grade level?",
    options: ["Elementary (K-5)", "Middle School (6-8)", "High School (9-12)"]
  },
  {
    question: "How would you rate your child's academic performance?",
    options: ["Above Average", "Average", "Below Average"]
  },
  {
    question: "What is your child's preferred learning style?",
    options: ["Visual Learner", "Auditory Learner", "Kinesthetic Learner"]
  },
  {
    question: "How many hours does your child spend on homework daily?",
    options: ["Less than 1 hour", "1-2 hours", "More than 2 hours"]
  },
  {
    question: "What type of extracurricular activities is your child interested in?",
    options: ["Sports", "Arts & Music", "Academic Clubs"]
  },
  {
    question: "How would you describe your child's social interaction at school?",
    options: ["Very Social", "Moderately Social", "Less Social"]
  },
  {
    question: "What is your child's biggest challenge in school?",
    options: ["Academic Performance", "Time Management", "Social Skills"]
  },
  {
    question: "What are your educational goals for your child?",
    options: ["Academic Excellence", "Well-rounded Development", "Specific Skill Focus"]
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
          answers: `
Child's Name: ${formData.childName}
Child's Age: ${formData.childAge}
Child's Gender: ${formData.childGender}

Step 1: ${formData.step1}
Step 2: ${formData.step2}
Step 3: ${formData.step3}
Step 4: ${formData.step4}
Step 5: ${formData.step5}
Step 6: ${formData.step6}
Step 7: ${formData.step7}
Step 8: ${formData.step8}`
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
    } else if (currentStep <= 8) {
      return (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {questions[currentStep - 1].question}
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={formData[`step${currentStep}`]}
              onChange={(e) => handleRadioChange(`step${currentStep}`, e.target.value)}
            >
              {questions[currentStep - 1].options.map((option, index) => (
                <FormControlLabel 
                  key={index}
                  value={option} 
                  control={<Radio />} 
                  label={option} 
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!formData[`step${currentStep}`]}
            sx={{ mt: 2 }}
          >
            Next
          </Button>
        </Box>
      );
    } else if (currentStep === 9) {
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Child Education Assessment
            </Typography>
            
            <Stepper activeStep={currentStep - 1} alternativeLabel sx={{ mb: 4 }}>
              {[...Array(10)].map((_, index) => (
                <Step key={index}>
                  <StepLabel>Step {index + 1}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {renderStep()}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default AssessmentForm; 