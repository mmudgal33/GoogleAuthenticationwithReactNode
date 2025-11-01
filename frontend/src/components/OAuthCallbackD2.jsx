// components/OAuthCallback.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button, Paper } from '@mui/material';
import YouTubeAuthService from '../services/YouTubeAuthService';

const OAuthCallbackD2 = () => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const authorizationCode = urlParams.get('code');
        const error = urlParams.get('error');

        console.log('inside OAuthCallbackD2')

        if (error) {
          setStatus('error');
          setError(`Authorization failed: ${error}`);
          return;
        }

        if (!authorizationCode) {
          setStatus('error');
          setError('No authorization code received');
          return;
        }

        // Exchange code for tokens
        await YouTubeAuthService.exchangeCodeForToken(authorizationCode);
        setStatus('success');

        // Redirect to main page after a short delay
        setTimeout(() => {
          navigate('/');
        }, 5000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setError(error.message);
      }
    };

    handleOAuthCallback();
  }, [location, navigate]);

  if (status === 'processing') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6">Completing authentication...</Typography>
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 3,
        }}
      >
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Authentication Failed
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 2,
      }}
    >
      <Typography variant="h5" color="success.main">
        Authentication Successful!
      </Typography>
      <Typography variant="body1">
        Redirecting you to the application...
      </Typography>
    </Box>
  );
};

export default OAuthCallbackD2;