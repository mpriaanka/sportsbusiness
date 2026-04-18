import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('%c🚀 ProStar Academy is live at http://ProStarAcademy:5173', 'color: #D4AF37; font-weight: bold; font-size: 16px;');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
