import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Find the root HTML element and render the React application inside it.
createRoot(document.getElementById('root')).render(
  // StrictMode helps identify potential problems during development.
  <StrictMode>
    {/* Render the main Currency Converter component. */}
    <App />
  </StrictMode>,
)
