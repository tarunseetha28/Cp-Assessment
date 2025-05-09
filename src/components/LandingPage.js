import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 4
        }}
      >
        {/* Logo placeholder - replace src with your actual logo */}
        <Box sx={{ mb: 4 }}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ maxWidth: '200px', height: 'auto' }}
          />
        </Box>

        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontFamily: 'Gilroy, sans-serif',
            fontSize: '40px',
            fontWeight: 600,
            mb: 4,
            lineHeight: 1.2
          }}
        >
          Over 50% of Parents Say Teaching Math is Stressful. Is Your Child Struggling? Take Our Quick Assessment to Identify Their Math Level and Unlock the Right Support!
        </Typography>

        <Button 
          variant="contained" 
          color="primary"
          size="large"
          onClick={() => navigate('/assessment')}
          sx={{ 
            py: 2,
            px: 4,
            fontSize: '1.2rem',
            borderRadius: '8px'
          }}
        >
          Start Assessment
        </Button>
      </Box>
    </Container>
  );
}

export default LandingPage; 