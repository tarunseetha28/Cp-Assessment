import React from 'react';
import { Container, Box, Paper, Typography, Button, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

function ThankYou() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData } = location.state || {};

  const handleSeeResult = () => {
    navigate('/result', { state: { formData } });
  };

  return (
    <Container 
      maxWidth={false}
      sx={{ 
        minHeight: '100vh',
        width: '100%',
        backgroundImage: 'url(/assets/maskbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box sx={{ 
        width: '800px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}>
        <Paper elevation={3} sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: '20px',
          background: 'transparent',
          boxShadow: 'none',
          width: '100%'
        }}>
          <Box sx={{ mb: 4 }}>
            <img 
              src="/assets/tyimg.svg" 
              alt="Logo" 
              style={{ maxWidth: '400px', height: 'auto' }}
            />
          </Box>

          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontFamily: 'Gilroy-Bold, sans-serif',
              color: '#000000',
              mb: 3,
              fontSize:'30px',
              fontWeight:'bold'
            }}
          >
            Thank You for Sharing Your Details!
          </Typography>

          <Typography 
            variant="body1" 
            paragraph
            sx={{ 
              fontFamily: 'Gilroy-Medium, sans-serif',
              color: '#0097C4',
              mb: 2,
              fontSize: '30px',
              fontWeight:'bold'
            }}
          >
            You'll Receive Your Child's Assessment Result On Both WhatsApp And Email Shortly.
          </Typography>

          <Typography 
            variant="body1" 
            paragraph
            sx={{ 
              fontFamily: 'Gilroy-Medium, sans-serif',
              color: '#555555',
              mb: 2,
              fontSize: '18px'
            }}
          >
            Please Keep An Eye On Your Inbox And WhatsApp – It's On The Way! Also, Stay Tuned!
          </Typography>

          <Typography 
            variant="body1" 
            paragraph
            sx={{ 
              fontFamily: 'Gilroy-Medium, sans-serif',
              color: '#555555',
              mb: 4,
              fontSize: '18px'
            }}
          >
            We'll Be Sending You Free Math Resources Designed To Help Your Kid Build Strong Math Skills – Straight To Your Email And WhatsApp.
          </Typography>



          {/* Social Media Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* YouTube Block */}
      <Box
        sx={{
          width: '100%',
          border: '1px solid #888888',
          borderRadius: '20px',
          padding: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Gilroy-SemiBold, sans-serif',
            color: '#000000',
            fontSize: 16,
            textAlign:'left',
            width:'459px'
          }}
        >
<b>Subscribe Our YouTube Channel</b> For Regular Updates, Learning Tips, And Fun Nursery Rhyme Songs For Your Kids        </Typography>
       
<IconButton
  href="https://youtube.com"
  target="_blank"
  disableRipple
  sx={{
    padding: 1,
    backgroundColor: 'transparent !important',
    '&:hover': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
    '&:focus': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
  }}
>
  <Box
    component="img"
    src="/assets/yt.svg"
    alt="YouTube"
  />
</IconButton>


      </Box>

      {/* Facebook + Instagram Block */}
      <Box
        sx={{
          width: '100%',
          border: '1px solid #888888',
          borderRadius: '20px',
          padding: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Gilroy-SemiBold, sans-serif',
            color: '#000000',
            width:'459px',
            textAlign:'left',
            fontSize: 16,
          }}
        >
          <b>Follow Us On Facebook And Instagram</b> For More Learning Resources, Updates, And Fun Activities For Your Kids!
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
  <IconButton
    href="https://facebook.com"
    target="_blank"
    disableRipple
    sx={{
      padding: 1,
      backgroundColor: 'transparent !important',
      '&:hover': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
      '&:focus': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    }}
  >
    <Box
      component="img"
      src="/assets/fb.svg" // Replace with actual path to your Facebook icon
      alt="Facebook"
     
    />
  </IconButton>

  <IconButton
    href="https://instagram.com"
    target="_blank"
    disableRipple
    sx={{
      padding: 1,
      backgroundColor: 'transparent !important',
      '&:hover': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
      '&:focus': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    }}
  >
    <Box
      component="img"
      src="/assets/inst.svg" // Replace with actual path to your Instagram icon
      alt="Instagram"

    />
  </IconButton>
</Box>

      </Box>

      {/* Learning Resources Block */}
      <Box
        sx={{
          width: '100%',
          border: '1px solid #888888',
          borderRadius: '20px',
          padding: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Gilroy-SemiBold, sans-serif',
            color: '#000000',
            width:'459px',
            textAlign:'left',
            fontSize: 16,
          }}
        >
         <b> Explore our learning resources</b>
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#000000',
            color:'#FFFFFF',
            borderRadius:'30px',
            px:4,
            py:1.5,
            fontFamily:'Gilroy-SemiBold, sans-serif',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#000000',
            },
          }}
        >
          Explore
        </Button>
      </Box>
    </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center',marginTop:'20px' }}>
            <Button
              variant="contained"
              onClick={handleSeeResult}
              sx={{
                backgroundColor: '#7B3FA9',
                color: '#FFFFFF',
                borderRadius: '30px',
                px: 4,
                py: 1.5,
                fontFamily: 'Gilroy-SemiBold, sans-serif',
                '&:hover': {
                  backgroundColor: '#6B2F99',
                },
              }}
            >
              See Result
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{
                borderColor: '#7B3FA9',
                color: '#7B3FA9',
                borderRadius: '30px',
                px: 4,
                py: 1.5,
                fontFamily: 'Gilroy-SemiBold, sans-serif',
                '&:hover': {
                  borderColor: '#6B2F99',
                  backgroundColor: 'rgba(123, 63, 169, 0.05)',
                },
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default ThankYou; 