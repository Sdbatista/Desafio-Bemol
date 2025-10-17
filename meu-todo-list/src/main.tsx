// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.tsx' // <--- 1. IMPORTE O PROVIDER

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. ENVOLVA O <App /> */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)