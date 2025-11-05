import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { initI18n } from './i18n'
import './index.css'

const rootElement = document.getElementById('app')

if (!rootElement) {
  console.error('Root element not found!')
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Error: Root element not found</h1><p>Please ensure the HTML contains an element with id="app"</p></div>'
} else {
  // Initialize i18n and render app
  ;(async () => {
    try {
      await initI18n()
    } catch (error) {
      console.error('Failed to initialize i18n:', error)
      // Continue anyway - app should work without i18n
    }

    try {
      ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
          <BrowserRouter>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </BrowserRouter>
        </React.StrictMode>
      )
    } catch (error) {
      console.error('Failed to render app:', error)
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h1>Failed to load application</h1>
          <p>${error.message || 'Unknown error'}</p>
          <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px;">Reload Page</button>
        </div>
      `
    }
  })()
}

