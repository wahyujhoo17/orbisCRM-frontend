import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GooeyToaster } from 'goey-toast'
import 'goey-toast/styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <GooeyToaster position="bottom-right" />
  </React.StrictMode>,
)
