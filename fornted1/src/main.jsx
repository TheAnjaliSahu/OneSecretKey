//import { StrictMode } from 'react'
import React from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom'
import App from './App';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
//import App from './App.jsx'
// import { ToastContainer } from 'react-toastify';  // <-- Add this line

// import 'react-toastify/dist/ReactToastify.css';
createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
  <React.StrictMode>
    <App />
    {/* <ToastContainer/> */}
  </React.StrictMode>
  </BrowserRouter>
 
);
