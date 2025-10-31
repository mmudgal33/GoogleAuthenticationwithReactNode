// services/youtubeAuth.js
import { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_GOOGLE_REDIRECT_URI, REACT_APP_GOOGLE_CLIENT_SECRET } from '../../dataD2'




class YouTubeAuthService {
    constructor() {
      // this.CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      // this.REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth2callback';
      this.CLIENT_ID = REACT_APP_GOOGLE_CLIENT_ID;
      this.REDIRECT_URI = REACT_APP_GOOGLE_REDIRECT_URI || 'http://localhost:5173/oauth2callback';
      
      this.SCOPES = [
        'https://www.googleapis.com/auth/youtube.force-ssl',
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.channel-memberships.creator'
      ].join(' ');
    }
  
    // // Generate the OAuth 2.0 URL
    // getAuthUrl() {
    //   const params = new URLSearchParams({
    //     client_id: this.CLIENT_ID,
    //     redirect_uri: this.REDIRECT_URI,
    //     response_type: 'code',
    //     scope: this.SCOPES,
    //     access_type: 'offline',
    //     prompt: 'consent',
    //   });


    //   console.log('inside getAuthUrl()')
  
    //   return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    // }


    getAuthUrl() {
      // Use environment variable with fallback for development
      const clientId = this.CLIENT_ID || 'your-client-id';
      
      // Dynamically determine redirect URI based on environment
      // const redirectUri = window.location.origin + '/oauth2callback';
      const redirectUri = window.location.origin + '/google/callback';
      
      const scopes = this.SCOPES;
  
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', scopes);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent'); // Important: ensures refresh token
  
      return authUrl.toString();
    }


  
    // Exchange authorization code for access token
    async exchangeCodeForToken(authorizationCode) {
      try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: this.CLIENT_ID,
            // client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
            client_secret: REACT_APP_GOOGLE_CLIENT_SECRET,
            code: authorizationCode,
            grant_type: 'authorization_code',
            redirect_uri: this.REDIRECT_URI,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Token exchange failed: ${response.statusText}`);
        }
  
        const tokenData = await response.json();
        this.saveTokens(tokenData);
        return tokenData;
      } catch (error) {
        console.error('Error exchanging code for token:', error);
        throw error;
      }
    }
  
    // Refresh access token
    async refreshAccessToken() {
      const refreshToken = localStorage.getItem('youtube_refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
  
      try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: this.CLIENT_ID,
            // client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
            client_secret: REACT_APP_GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Token refresh failed: ${response.statusText}`);
        }
  
        const tokenData = await response.json();
        this.saveTokens(tokenData);
        return tokenData;
      } catch (error) {
        console.error('Error refreshing token:', error);
        this.clearTokens();
        throw error;
      }
    }
  
    // Save tokens to localStorage
    saveTokens(tokenData) {
      const expiresAt = Date.now() + (tokenData.expires_in * 1000);
      
      localStorage.setItem('youtube_access_token', tokenData.access_token);
      localStorage.setItem('youtube_token_expires_at', expiresAt.toString());
      
      if (tokenData.refresh_token) {
        localStorage.setItem('youtube_refresh_token', tokenData.refresh_token);
      }
    }
  
    // Get stored access token
    getAccessToken() {
      return localStorage.getItem('youtube_access_token');
    }
  
    // Check if token is valid
    isTokenValid() {
      const accessToken = this.getAccessToken();
      const expiresAt = localStorage.getItem('youtube_token_expires_at');
      
      if (!accessToken || !expiresAt) {
        return false;
      }
  
      return Date.now() < parseInt(expiresAt);
    }
  
    // Clear all tokens
    clearTokens() {
      localStorage.removeItem('youtube_access_token');
      localStorage.removeItem('youtube_refresh_token');
      localStorage.removeItem('youtube_token_expires_at');
    }
  
    // Get valid access token (refreshes if needed)
    async getValidAccessToken() {
      if (this.isTokenValid()) {
        return this.getAccessToken();
      }
  
      try {
        const tokenData = await this.refreshAccessToken();
        return tokenData.access_token;
      } catch (error) {
        this.clearTokens();
        throw new Error('Authentication required');
      }
    }
  }
  
  export default new YouTubeAuthService();