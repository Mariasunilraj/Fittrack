import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

// Register PWA Service Worker for Offline Functionality & Installability
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[FitTrack PWA] Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.warn('[FitTrack PWA] Service Worker registration failed:', error);
      });
  });
}

function mountFitTrack() {
  let rootElement = document.getElementById('root');
  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (err) {
    console.error('[FitTrack Mount Error]:', err);
    const errBanner = document.createElement('div');
    errBanner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:#b91c1c;color:#fff;padding:20px;font-family:monospace;font-size:14px;';
    errBanner.textContent = 'FitTrack Mounting Error: ' + (err as Error).message;
    document.body.prepend(errBanner);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountFitTrack);
} else {
  mountFitTrack();
}
