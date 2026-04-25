// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AppLayout from '../components/layout/AppLayout'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import JobListPage from '../pages/JobListPage'
import JobDetailPage from '../pages/JobDetailPage'
import JobCreatePage from '../pages/JobCreatePage'
import JobEditPage from '../pages/JobEditPage'
import CategoryPage from '../pages/CategoryPage'

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Private */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/jobs" replace />} />
        <Route path="jobs"          element={<JobListPage />} />
        <Route path="jobs/create"   element={<JobCreatePage />} />
        <Route path="jobs/:id"      element={<JobDetailPage />} />
        <Route path="jobs/:id/edit" element={<JobEditPage />} />
        <Route path="categories"    element={<CategoryPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/jobs" replace />} />
    </Routes>
  )
}
