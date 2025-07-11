import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: 'url(/assets/maskbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        p: 0,
        m: 0,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="lg" sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 4
      }}>
        {/* Logo */}
        <Box sx={{ mb: 4 }}>
          <img 
            src="/assets/logo.png" 
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
            fontWeight: 400,
            mb: 4,
            lineHeight: 1.2
          }}
        >
          Over 50% of Parents Say Teaching Math is Stressful. <b>Is Your Child Struggling?</b> Take Our Quick Assessment to Identify Their Math Level and Unlock the Right Support!
        </Typography>

        <Button onClick={() => navigate('/assessment')}>
          Start Assessment
        </Button>
      </Container>
    </Box>
  );
}

export default LandingPage; 