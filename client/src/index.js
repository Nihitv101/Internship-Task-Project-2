import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import {CssBaseline} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(
  <React.StrictMode>     
    <CssBaseline />
    <App />
    <Toaster />
  </React.StrictMode>
);

