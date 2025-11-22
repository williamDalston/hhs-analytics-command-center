import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  // Keep critical error logging
  console.error('Root element not found! Make sure there is a <div id="root"></div> in index.html')
  document.body.innerHTML = '<div style="padding: 2rem; font-family: monospace;"><h1>Error: Root element not found</h1><p>Could not find element with id="root"</p></div>'
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } catch (error) {
    // Keep critical error logging
    console.error('Error rendering React app:', error.message)
    if (import.meta.env.DEV) {
      console.error('Full error details:', error)
    }
    rootElement.innerHTML = `
      <div style="padding: 2rem; font-family: monospace;">
        <h1>Error Loading App</h1>
        <p>${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `
  }
}
