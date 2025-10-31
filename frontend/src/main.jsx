import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import AppD2 from './AppD2.jsx'

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import GoogleCallback from './components/GoogleCallback';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  // <App />,
  <AppD2 />,

  // <Router>
  //     <Routes>
  //       <Route path="/" element={<AppD2 />} />
  //       <Route path="/google/callback" element={<GoogleCallback />} />
  //       {/* other routes */}
  //     </Routes>
  //   </Router>,
)
