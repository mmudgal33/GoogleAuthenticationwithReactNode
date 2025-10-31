
export const REACT_APP_YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
export const REACT_APP_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const REACT_APP_GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
export const REACT_APP_GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;



const production = {
    url: 'https://googleauthenticationwithreactnodef.onrender.com',
    api: 'https://googleauthenticationwithreactnode.onrender.com'
    //api: 'https://mern-task-app-foodorderingfrontend1-api.onrender.com'
  };
  const development = {
    url: 'http://localhost:5173',
    api: 'http://localhost:8080'
  };
export const config = process.env.NODE_ENV === 'development' ? development : production;






