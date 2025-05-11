import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  Grid,
  Button,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AssessmentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        minHeight: '100vh',
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <img 
            src="/assets/logo.png" 
            alt="Logo" 
            style={{ maxWidth: '200px', height: 'auto', marginBottom: '2rem' }}
          />
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontFamily: 'Gilroy-Bold, sans-serif',
              fontWeight: 600,
              color: 'rgba(0, 151, 196, 1)',
              mb: 2
            }}
          >
            Math Assessment
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: 'Gilroy-Medium, sans-serif',
              color: 'rgba(0, 0, 0, 0.7)',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Take our comprehensive math assessment to identify your child's strengths and areas for improvement
          </Typography>
        </Box>

        {/* Main Content */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Left Column - Assessment Info */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                height: '100%',
                background: 'rgba(154, 232, 255, 0.1)',
                borderRadius: '20px'
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontFamily: 'Gilroy-Bold, sans-serif',
                  mb: 3,
                  color: 'rgba(0, 151, 196, 1)'
                }}
              >
                What to Expect
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                  📝 Age-Appropriate Questions
                </Typography>
                <Typography sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                  Questions tailored to your child's age group, focusing on key mathematical concepts and skills.
                </Typography>
              </Box>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                  ⏱️ Quick & Engaging
                </Typography>
                <Typography sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                  Takes about 10-15 minutes to complete. Interactive and child-friendly interface.
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                  📊 Detailed Analysis
                </Typography>
                <Typography sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                  Receive a comprehensive report with strengths, areas for improvement, and personalized recommendations.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Start Assessment */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                height: '100%',
                background: 'rgba(123, 63, 169, 0.1)',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontFamily: 'Gilroy-Bold, sans-serif',
                  mb: 3,
                  color: 'rgba(123, 63, 169, 1)'
                }}
              >
                Ready to Begin?
              </Typography>
              <Typography 
                sx={{ 
                  mb: 4,
                  color: 'rgba(0, 0, 0, 0.7)',
                  maxWidth: '400px'
                }}
              >
                Start the assessment now and get personalized insights about your child's mathematical abilities.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/assessment')}
                disabled={loading}
                sx={{
                  background: 'rgba(123, 63, 169, 1)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '10px',
                  fontFamily: 'Gilroy-SemiBold, sans-serif',
                  '&:hover': {
                    background: 'rgba(123, 63, 169, 0.9)',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Start Assessment'}
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 'auto' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(0, 0, 0, 0.5)',
              fontFamily: 'Gilroy-Medium, sans-serif'
            }}
          >
            © 2024 Math Assessment. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default AssessmentPage; 