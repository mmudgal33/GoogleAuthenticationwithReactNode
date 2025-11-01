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
        }, 3000);

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


























// // OAuthCallbackD2.jsx
// import React, { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Box, Typography, CircularProgress, Alert } from '@mui/material';
// import YouTubeAuthService from '../services/YouTubeAuthService';

// const OAuthCallbackD2 = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     console.log('🔄 OAuthCallbackD2 mounted');
//     console.log('📍 Current path:', location.pathname);
//     console.log('🔍 Search params:', location.search);
    
//     const handleOAuthCallback = async () => {
//       try {
//         // Parse the URL parameters
//         const urlParams = new URLSearchParams(location.search);
//         const code = urlParams.get('code');
//         const error = urlParams.get('error');
        
//         console.log('📥 Authorization code:', code);
//         console.log('❌ Error parameter:', error);

//         if (error) {
//           console.error('OAuth error:', error);
//           navigate('/?error=auth_failed&message=' + error);
//           return;
//         }

//         if (!code) {
//           console.error('No authorization code received');
//           navigate('/?error=no_code');
//           return;
//         }

//         console.log('🔄 Exchanging code for token...');
        
//         // Exchange code for tokens
//         const tokenData = await YouTubeAuthService.exchangeCodeForToken(code);
//         console.log('✅ Token received:', tokenData);

//         if (tokenData.accessToken) {
//           // Store tokens
//           YouTubeAuthService.setToken(tokenData.accessToken, tokenData.refreshToken);
          
//           // Redirect to home page with success
//           navigate('/?auth=success');
//         } else {
//           throw new Error('No access token received');
//         }

//       } catch (error) {
//         console.error('❌ OAuth callback error:', error);
//         navigate('/?error=token_exchange_failed&message=' + error.message);
//       }
//     };

//     handleOAuthCallback();
//   }, [location, navigate]);

//   return (
//     <Box 
//       sx={{ 
//         display: 'flex', 
//         flexDirection: 'column',
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         minHeight: '60vh',
//         padding: 3
//       }}
//     >
//       <CircularProgress size={60} sx={{ mb: 3 }} />
//       <Typography variant="h5" gutterBottom>
//         Completing Authentication...
//       </Typography>
//       <Typography variant="body1" color="text.secondary">
//         Please wait while we securely log you in.
//       </Typography>
//     </Box>
//   );
// };

// export default OAuthCallbackD2;