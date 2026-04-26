// src/components/layout/PublicLayout.jsx
import { Link, Outlet, useNavigate } from 'react-router-dom'

export default function PublicLayout() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#fff', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh' }}>
      {/* Navbar */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#111827', letterSpacing: '-0.01em' }}>FreMed</span>
          </Link>

          {/* Nav Links */}
          <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <Link to="/" style={{ color: '#374151', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Trang chủ</Link>
            <Link to="/jobs" style={{ color: '#374151', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tuyển dụng</Link>
            <Link to="/products" style={{ color: '#374151', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Sản phẩm</Link>
          </nav>

          {/* Admin */}
          <Link to="/admin/jobs" style={{ background: '#111827', color: '#fff', padding: '7px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Admin
          </Link>
        </div>
      </header>

      <main style={{ background: '#fff' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: '#111827', color: '#9ca3af', marginTop: 80, padding: '36px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, display: 'block', marginBottom: 10 }}>FreMed</span>
            <p style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 300 }}>
              Công ty Cổ phần Dược phẩm CKM - Nhãn Khoa Sài Gòn<br />
              1467/32 Phạm Thế Hiển, P.6, Q.8, TP.HCM
            </p>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 10, fontSize: 14 }}>Liên hệ</div>
            <p style={{ fontSize: 13, lineHeight: 1.8 }}>Email: talents@fremed.com.vn</p>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '20px auto 0', paddingTop: 20, borderTop: '1px solid #374151', fontSize: 12, textAlign: 'center' }}>
          © 2025 FreMed. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
