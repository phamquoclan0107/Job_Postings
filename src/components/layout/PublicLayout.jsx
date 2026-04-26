// src/components/layout/PublicLayout.jsx
import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'

export default function PublicLayout() {
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: '#f5f7fa', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Navbar */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1a7a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>F</div>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#1a2340' }}>FreMed</span>
          </Link>

          {/* Nav Links */}
          <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <Link to="/" style={{ color: '#4b5563', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Trang chủ</Link>
            <Link to="/jobs" style={{ color: '#4b5563', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tuyển dụng</Link>
            <Link to="/products" style={{ color: '#4b5563', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Sản phẩm</Link>
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/cart')}
              style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, color: '#4b5563' }}
            >
              <CartIcon />
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: 2, right: 2, background: '#1a7a4a', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
            <Link to="/admin/jobs" style={{ background: '#1a7a4a', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: '#1a2340', color: '#9ca3af', marginTop: 80, padding: '40px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1a7a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16 }}>F</div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>FreMed</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 300 }}>
              Công ty Cổ phần Dược phẩm CKM - Nhãn Khoa Sài Gòn<br />
              1467/32 Phạm Thế Hiển, P.6, Q.8, TP.HCM
            </p>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Liên hệ</div>
            <p style={{ fontSize: 13, lineHeight: 1.8 }}>Email: talents@fremed.com.vn</p>
            <p style={{ fontSize: 13, lineHeight: 1.8 }}>Nộp hồ sơ: talents@fremed.com.vn</p>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '24px auto 0', paddingTop: 24, borderTop: '1px solid #2d3748', fontSize: 12, textAlign: 'center' }}>
          © 2025 FreMed. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  )
}