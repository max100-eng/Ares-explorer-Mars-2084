import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './input.css' // Import Tailwind CSS
import './index.css' // Import custom styles
import { SpeedInsights } from "@vercel/speed-insights/react" 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <SpeedInsights />
  </React.StrictMode>,
)