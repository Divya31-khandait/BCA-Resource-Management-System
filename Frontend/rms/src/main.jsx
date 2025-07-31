import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner'; // ✅ Import Toaster
import './index.css';
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error(
    "Failed to find root element. Make sure you have a <div id='root'></div> in your index.html."
  );
}
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" richColors /> {/* ✅ Mount Toaster here */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
