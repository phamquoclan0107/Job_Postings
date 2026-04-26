// src/components/layout/AppLayout.jsx
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/admin/jobs',       label: 'Tin tuyển dụng', icon: BriefcaseIcon },
  { to: '/admin/categories', label: 'Danh mục',        icon: TagIcon },
  { to: '/admin/products',   label: 'Sản phẩm',        icon: BoxIcon },
]

export default function AppLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Đã đăng xuất')
    navigate('/login')
  }

  const W = collapsed ? 64 : 220

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      {/* Sidebar */}
      <aside style={{
        width: W,
        flexShrink: 0,
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        transition: 'width 0.2s',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div
          onClick={() => setCollapsed(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '20px 16px' : '20px 20px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#111827', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>F</div>
          {!collapsed && <span style={{ fontWeight: 700, fontSize: 16, color: '#111827', whiteSpace: 'nowrap' }}>FreMed Admin</span>}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#111827' : '#6b7280',
                background: isActive ? '#f3f4f6' : 'transparent',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'background 0.15s',
              })}
            >
              <Icon />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: user + profile + logout */}
        <div style={{ borderTop: '1px solid #f3f4f6', padding: '12px 8px' }}>
          {/* Profile link — click vào avatar/username */}
          <NavLink
            to="/admin/profile"
            title="Tài khoản của tôi"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              marginBottom: 4,
              borderRadius: 8,
              textDecoration: 'none',
              background: isActive ? '#f3f4f6' : 'transparent',
              transition: 'background 0.15s',
            })}
          >
            <div style={{ width: 30, height: 30, borderRadius: 6, background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff', flexShrink: 0 }}>
              {admin?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            {!collapsed && admin && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{admin.username}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{admin.email || 'Admin'}</div>
              </div>
            )}
          </NavLink>

          <button
            onClick={handleLogout}
            title="Đăng xuất"
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#6b7280', whiteSpace: 'nowrap' }}
          >
            <LogoutIcon />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', padding: 32, background: '#fff', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  )
}

function BriefcaseIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
}
function TagIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m20.59 13.41-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
}
function BoxIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
}
function LogoutIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
}