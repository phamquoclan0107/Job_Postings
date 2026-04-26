import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext' // 👈 thêm dòng này

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* 👈 bọc ở đây */}
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#13161e',
              color: '#f0f2f8',
              border: '1px solid #232736',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#3ecf8e', secondary: '#13161e' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#13161e' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)