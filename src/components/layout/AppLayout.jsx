// src/components/layout/AppLayout.jsx
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/jobs',       label: 'Tin tuyển dụng', icon: BriefcaseIcon },
  { to: '/categories', label: 'Danh mục',        icon: TagIcon },
]

function BriefcaseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/>
    </svg>
  )
}
function TagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m20.59 13.41-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  )
}
function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

export default function AppLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Đã đăng xuất')
    navigate('/login')
  }

  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: collapsed ? 64 : 220 }}>
        <div style={styles.logo} onClick={() => setCollapsed((v) => !v)}>
          {collapsed ? (
            <span style={styles.logoMark}>J</span>
          ) : (
            <>
              <span style={styles.logoMark}>J</span>
              <span style={styles.logoText}>JobAdmin</span>
            </>
          )}
        </div>

        <nav style={styles.nav}>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                ...styles.navItem,
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                color:      isActive ? 'var(--accent)' : 'var(--text-sec)',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              })}
            >
              <Icon />
              {!collapsed && <span style={{ marginLeft: 10 }}>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={styles.sidebarBottom}>
          {!collapsed && admin && (
            <div style={styles.adminInfo}>
              <div style={styles.adminAvatar}>{admin.username?.[0]?.toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{admin.username}</div>
                <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>{admin.email || 'Admin'}</div>
              </div>
            </div>
          )}
          <button style={styles.logoutBtn} onClick={handleLogout} title="Đăng xuất">
            <LogoutIcon />
            {!collapsed && <span style={{ marginLeft: 8 }}>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg)',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-card)',
    borderRight: '1px solid var(--border)',
    transition: 'width 0.2s ease',
    overflow: 'hidden',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '24px 16px 20px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'var(--accent)',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-head)',
    fontWeight: 800,
    fontSize: 18,
    flexShrink: 0,
  },
  logoText: {
    fontFamily: 'var(--font-head)',
    fontWeight: 700,
    fontSize: 18,
    color: 'var(--text-pri)',
    whiteSpace: 'nowrap',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: '0 8px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    transition: 'var(--transition)',
    whiteSpace: 'nowrap',
  },
  sidebarBottom: {
    padding: '12px 8px 16px',
    borderTop: '1px solid var(--border)',
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 10px 12px',
  },
  adminAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'var(--border-light)',
    color: 'var(--text-pri)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    background: 'transparent',
    border: 'none',
    color: 'var(--text-sec)',
    fontSize: 14,
    fontWeight: 500,
    transition: 'var(--transition)',
    whiteSpace: 'nowrap',
  },
  main: {
    flex: 1,
    overflow: 'auto',
    padding: '32px 36px',
    minWidth: 0,
  },
}
