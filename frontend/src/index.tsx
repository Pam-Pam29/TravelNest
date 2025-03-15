import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';  // Change this line

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {/* Your app components */}
    </React.StrictMode>
  );
}
