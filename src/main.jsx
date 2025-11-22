import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root')

if (!rootElement) {
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
    console.error('Error rendering React app:', error)
    rootElement.innerHTML = `
      <div style="padding: 2rem; font-family: monospace;">
        <h1>Error Loading App</h1>
        <p>${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `
  }
}
