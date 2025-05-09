import React from 'react';
import { Container, Box, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ThankYou() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Thank You!
          </Typography>
          <Typography variant="body1" paragraph>
            Your assessment has been submitted successfully.
          </Typography>
          <Typography variant="body1" paragraph>
            We will review your responses and get back to you soon.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default ThankYou; 