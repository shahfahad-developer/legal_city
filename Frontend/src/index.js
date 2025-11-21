import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
<<<<<<< HEAD
=======
import { SocketProvider } from './context/SocketContext';
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
<<<<<<< HEAD
        <App />
=======
        <SocketProvider>
          <App />
        </SocketProvider>
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
