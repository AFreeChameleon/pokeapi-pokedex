import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';

const rootDOM = document.getElementById('root');
if (rootDOM) {
  const root = ReactDOM.createRoot(rootDOM);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('No DOM element with ID = root present.');
}