import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// 1. Importamos la librería que acabas de instalar
import { SpeedInsights } from "@vercel/speed-insights/react" 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    {/* 2. Activamos el monitor de rendimiento */}
    <SpeedInsights />
  </React.StrictMode>,
)