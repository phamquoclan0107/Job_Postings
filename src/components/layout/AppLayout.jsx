// src/components/layout/AppLayout.jsx
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/admin/jobs',       label: 'Tin tuyển dụng', icon: BriefcaseIcon },
  { to: '/admin/categories', label: 'Danh mục',        icon: TagIcon },
  { to: '/admin/products', label: 'Sản phẩm', icon: TagIcon },
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
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside
        className="flex flex-col bg-bg-card border-r border-border transition-[width] duration-200 overflow-hidden flex-shrink-0 sticky top-0 h-screen"
        style={{ width: collapsed ? 64 : 220 }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 px-4 pt-6 pb-5 cursor-pointer select-none"
          onClick={() => setCollapsed((v) => !v)}
        >
          <div className="w-8 h-8 rounded-lg bg-accent text-black flex items-center justify-center font-head font-extrabold text-[18px] flex-shrink-0">
            J
          </div>
          {!collapsed && (
            <span className="font-head font-bold text-[18px] text-text-pri whitespace-nowrap">JobAdmin</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-2 flex-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-[180ms] whitespace-nowrap border-l-2 ${
                  isActive
                    ? 'bg-accent-dim text-accent border-accent'
                    : 'bg-transparent text-text-sec border-transparent hover:bg-bg-hover'
                }`
              }
            >
              <Icon />
              {!collapsed && <span className="ml-2.5">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 pt-3 border-t border-border">
          {!collapsed && admin && (
            <div className="flex items-center gap-2.5 px-2.5 pb-3">
              <div className="w-8 h-8 rounded-lg bg-border-light text-text-pri flex items-center justify-center font-bold text-sm flex-shrink-0">
                {admin.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="text-[13px] font-semibold">{admin.username}</div>
                <div className="text-[11px] text-text-mute">{admin.email || 'Admin'}</div>
              </div>
            </div>
          )}
          <button
            className="flex items-center w-full px-3 py-[9px] rounded-lg bg-transparent border-0 text-text-sec text-sm font-medium transition-all duration-[180ms] whitespace-nowrap hover:bg-bg-hover"
            onClick={handleLogout}
            title="Đăng xuất"
          >
            <LogoutIcon />
            {!collapsed && <span className="ml-2">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}