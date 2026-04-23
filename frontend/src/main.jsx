import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from "@clerk/react"
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key. Add VITE_CLERK_PUBLISHABLE_KEY to your .env file.')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'Sora, sans-serif',
              fontSize: '14px',
            },
            success: {
              style: {
                background: '#4361f5',
                color: '#fff',
              },
              iconTheme: { primary: '#fff', secondary: '#4361f5' },
            },
            error: {
              style: {
                background: '#ef4444',
                color: '#fff',
              },
              iconTheme: { primary: '#fff', secondary: '#ef4444' },
            },
          }}
        />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
)
