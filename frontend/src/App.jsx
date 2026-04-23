import { Routes, Route, Navigate } from 'react-router-dom'
import { SignIn, SignUp, useAuth } from "@clerk/react"
import { useTheme } from './hooks/useTheme'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  useTheme() // Initialize theme on app load

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/sign-in/*"
        element={
          <AuthLayout>
            <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="/dashboard" />
          </AuthLayout>
        }
      />
      <Route
        path="/sign-up/*"
        element={
          <AuthLayout>
            <SignUp routing="path" path="/sign-up" fallbackRedirectUrl="/dashboard" />
          </AuthLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] px-4">
      <div className="animate-fade-in">
        {children}
      </div>
    </div>
  )
}
