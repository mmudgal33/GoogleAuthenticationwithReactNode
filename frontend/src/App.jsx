// App.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import YouTubeCommentsD2 from './components/YouTubeCommentsD2';
import OAuthCallbackD2 from './components/OAuthCallbackD2';
import YouTubeAuthService from './services/YouTubeAuthService';
import YouTubeApiService from './services/youtubeApiD2';

import getDescription from './services/getDescription';
import YouTubeVideoTitle from './components/YouTubeVideoTitle';


function AppD2() {
  const [videoId, setVideoId] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [description, setDescription] = useState({});

  // const navigate = useNavigate();

  // var cauthUrl = '';

  // const [currentTab, setCurrentTab] = useState(0);

  console.log('isAuthenticated ', isAuthenticated);

  useEffect(() => {
    checkAuthentication();
  }, []);



  const checkAuthentication = () => {
    const authenticated = YouTubeAuthService.isTokenValid();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      loadUserProfile();
    }
  };

  const loadUserProfile = async () => {
    try {
      const response = await YouTubeApiService.getMyChannel();
      if (response.items && response.items.length > 0) {
        setUserProfile(response.items[0].snippet);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };


  // running
  const handleLogin = () => {
    const authUrl = YouTubeAuthService.getAuthUrl();
    // cauthUrl = authUrl;
    window.location.href = authUrl;
    // navigate("/google/callback");
  };

  // console.log('authUrl ', cauthUrl);


  useEffect(() => {
    localStorage.setItem('videoId',videoId);
    // setVideoId(localStorage.getItem('videoId'));
    getVideoData();
  }, [videoId]);


  const getVideoData = async () => {
    const description = await getDescription.fetchVideoData();
    // const description = await YouTubeApiService.getVideoDetails(videoId);

    console.log('description ', description);
    setDescription(description);
  };



  const handleLogout = () => {
    YouTubeAuthService.clearTokens();
    setIsAuthenticated(false);
    setUserProfile(null);
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleLoadComments = () => {
    if (videoId.trim()) {
      setCurrentVideoId(videoId);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              YouTube Comments Manager
            </Typography>

            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {userProfile && (
                  <Chip
                    label={userProfile.title}
                    avatar={<img src={userProfile.thumbnails.default.url} alt="Profile" />}
                  />
                )}
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleMenuOpen}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >

                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button color="inherit" onClick={handleLogin}>
                Login with Google
              </Button>

            )}
          </Toolbar>
        </AppBar>





        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/oauth2callback" element={<OAuthCallbackD2 />} /> 
            {/* <Route path="/google/callback" element={<OAuthCallbackD2 />} /> */}
            <Route path="/" element={
              <>
                

                {!isAuthenticated && (
                  <Paper sx={{ p: 3, mb: 3, backgroundColor: 'warning.light' }}>
                    <Typography variant="h6" gutterBottom>
                      Authentication Required
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      To post, edit, or delete comments, you need to authenticate with your Google account.
                    </Typography>
                    <Button variant="contained" onClick={handleLogin}>
                      Login with Google
                    </Button>
                  </Paper>
                )}

                {currentVideoId && isAuthenticated && (
                  <YouTubeVideoTitle 
                    videoId={currentVideoId} 
                    isAuthenticated={isAuthenticated}
                    onAuthRequired={handleLogin}
                    description={description}
                  />
                )}

                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Enter YouTube Video ID
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      label="YouTube Video ID"
                      variant="outlined"
                      value={videoId}
                      onChange={(e) => setVideoId(e.target.value)}
                      placeholder="e.g., dQw4w9WgXcQ"
                      sx={{ minWidth: 300 }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleLoadComments}
                      disabled={!videoId.trim()}
                      size="large"
                    >
                      Load Comments
                    </Button>
                    
                
              
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    You can find the video ID in the YouTube URL: youtube.com/watch?v=VIDEO_ID
                  </Typography>
                </Paper>

                {currentVideoId && isAuthenticated && (
                  <YouTubeCommentsD2 
                    videoId={currentVideoId} 
                    isAuthenticated={isAuthenticated}
                    onAuthRequired={handleLogin}
                    description={description}
                  />
                )}

                
              </>
            } />
          </Routes>
        </Container>

      </div>
    </Router>
  );
}

export default AppD2;







{/* <Container maxWidth="xl" sx={{ mt: 3 }}>
          <Routes>
            <Route path="/oauth2callback" element={<OAuthCallbackD2 />} />
            <Route path="/" element={
              <>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab label="Video Descriptions" />
                    <Tab label="Comments Manager" />
                  </Tabs>
                </Box>

                {!isAuthenticated && (
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Welcome to YouTube Manager
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      Please authenticate with your Google account to manage your YouTube content.
                    </Typography>
                    <Button variant="contained" size="large" onClick={handleLogin}>
                      Login with Google
                    </Button>
                  </Box>
                )}

                

                {isAuthenticated && (
                  <>

                    {currentTab === 0 && (

                      <YouTubeVideoTitle
                        videoId={currentVideoId}
                        isAuthenticated={isAuthenticated}
                        onAuthRequired={handleLogin}
                        description={description}
                      />

                    )}



                    {currentTab === 1 && (


                      <YouTubeCommentsD2
                        // videoId={currentVideoId}
                        isAuthenticated={isAuthenticated}
                        onAuthRequired={handleLogin}
                        // description={description}
                      />


                    )}

                  </>
                )}
              </>
            } />
          </Routes>
        </Container> */}






