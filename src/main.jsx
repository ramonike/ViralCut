import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log('[main.jsx] Environment variables check:');
console.log('[main.jsx] VITE_GOOGLE_CLIENT_ID:', clientId ? 'CONFIGURED ✓' : 'MISSING ✗');
console.log('[main.jsx] Full Client ID:', clientId);

if (!clientId) {
  console.error('[main.jsx] ⚠️ CRITICAL: VITE_GOOGLE_CLIENT_ID is not defined!');
  console.error('[main.jsx] Make sure you have a .env file with VITE_GOOGLE_CLIENT_ID');
  console.error('[main.jsx] After adding the .env file, restart the dev server');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)

