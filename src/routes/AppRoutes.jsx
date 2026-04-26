// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Layouts
import PublicLayout from '../components/layout/PublicLayout'
import AppLayout from '../components/layout/AppLayout'

// Public pages
import HomePage from '../pages/public/HomePage'
import PublicJobListPage from '../pages/public/PublicJobListPage'
import PublicJobDetailPage from '../pages/public/PublicJobDetailPage'
import ProductListPage from '../pages/public/ProductListPage'
import ProductDetailPage from '../pages/public/ProductDetailPage'
import CartPage from '../pages/public/CartPage'

// Auth pages
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'

// Admin — Job pages
import JobListPage from '../pages/JobListPage'
import JobDetailPage from '../pages/JobDetailPage'
import JobCreatePage from '../pages/JobCreatePage'
import JobEditPage from '../pages/JobEditPage'

// Admin — Product pages
import AdminProductListPage from '../pages/AdminProductListPage'
import AdminProductDetailPage from '../pages/AdminProductDetailPage'
import ProductCreatePage from '../pages/ProductCreatePage'
import ProductEditPage from '../pages/ProductEditPage'

// Admin — Other
import CategoryPage from '../pages/CategoryPage'
import ProfilePage from '../pages/ProfilePage'

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes (no layout) */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Public routes with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/"             element={<HomePage />} />
        <Route path="/jobs"         element={<PublicJobListPage />} />
        <Route path="/jobs/:id"     element={<PublicJobDetailPage />} />
        <Route path="/products"     element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart"         element={<CartPage />} />
      </Route>

      {/* Admin routes — all under /admin with AppLayout sidebar */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index                    element={<Navigate to="/admin/jobs" replace />} />

        {/* ── Tin tuyển dụng ── */}
        <Route path="jobs"              element={<JobListPage />} />
        <Route path="jobs/create"       element={<JobCreatePage />} />
        <Route path="jobs/:id"          element={<JobDetailPage />} />
        <Route path="jobs/:id/edit"     element={<JobEditPage />} />

        {/* ── Sản phẩm ── */}
        <Route path="products"          element={<AdminProductListPage />} />
        <Route path="products/create"   element={<ProductCreatePage />} />
        <Route path="products/:id"      element={<AdminProductDetailPage />} />
        <Route path="products/:id/edit" element={<ProductEditPage />} />

        {/* ── Danh mục ── */}
        <Route path="categories"        element={<CategoryPage />} />

        {/* ── Tài khoản ── */}
        <Route path="profile"           element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}