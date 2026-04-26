// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('vi-VN', { dateStyle: 'long', timeStyle: 'short' })
}

function getInitials(name, username) {
  if (name && name.trim()) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0][0].toUpperCase()
  }
  return (username?.[0] || 'A').toUpperCase()
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  page:      { maxWidth: 680, margin: '0 auto', paddingBottom: 40 },
  header:    { marginBottom: 28 },
  title:     { fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px' },
  sub:       { fontSize: 14, color: '#6b7280', margin: 0 },

  // Avatar card (top)
  avatarCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: '28px 32px',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: 20,
    background: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    fontWeight: 800,
    flexShrink: 0,
    letterSpacing: '-1px',
    userSelect: 'none',
    boxShadow: '0 4px 14px rgba(17,24,39,0.18)',
  },
  avatarName:  { fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 4 },
  avatarMeta:  { fontSize: 13, color: '#6b7280', display: 'flex', flexWrap: 'wrap', gap: '4px 16px' },
  avatarBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: 11, fontWeight: 700, color: '#059669',
    background: '#d1fae5', borderRadius: 99, padding: '2px 10px',
  },

  // Main card
  card:    { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden' },
  tabs:    { display: 'flex', borderBottom: '1px solid #e5e7eb', background: '#fafafa' },
  tab:     (active) => ({
    padding: '14px 28px', fontSize: 14, fontWeight: active ? 700 : 500,
    color: active ? '#111827' : '#6b7280',
    borderBottom: active ? '2px solid #111827' : '2px solid transparent',
    background: 'none', border: 'none', cursor: 'pointer', marginBottom: -1,
    transition: 'color 0.15s', display: 'flex', alignItems: 'center', gap: 6,
  }),
  body: { padding: '32px 32px 28px' },

  // Form
  section:   { marginBottom: 28 },
  secTitle:  { fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 },
  grid2:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  group:     { marginBottom: 20 },
  label:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input:     (disabled) => ({
    width: '100%', padding: '10px 14px',
    border: `1px solid ${disabled ? '#f3f4f6' : '#e5e7eb'}`, borderRadius: 10,
    fontSize: 14, color: disabled ? '#9ca3af' : '#111827',
    background: disabled ? '#f9fafb' : '#fff', boxSizing: 'border-box', outline: 'none',
    transition: 'border-color 0.15s',
  }),
  inputFocusStyle: { borderColor: '#111827' },
  roLock:    { fontSize: 11, fontWeight: 600, color: '#9ca3af', background: '#f3f4f6', borderRadius: 6, padding: '2px 8px' },

  // Divider
  divider: { height: 1, background: '#f3f4f6', margin: '8px 0 24px' },

  // Footer
  footer:  { display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 20, borderTop: '1px solid #f3f4f6', marginTop: 4 },
  btnPri:  (loading) => ({
    padding: '10px 28px', background: '#111827', color: '#fff', border: 'none',
    borderRadius: 10, fontSize: 14, fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.65 : 1,
    transition: 'opacity 0.15s',
  }),
  btnSec:  { padding: '10px 20px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },

  // Alert
  err:  { fontSize: 13, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 16px', marginBottom: 16 },
  succ: { fontSize: 13, color: '#059669', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 16px', marginBottom: 16 },

  // Info rows (metadata)
  metaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' },
  metaItem: { display: 'flex', flexDirection: 'column', padding: '12px 0', borderBottom: '1px solid #f9fafb' },
  metaKey:  { fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 },
  metaVal:  { fontSize: 14, color: '#111827', fontWeight: 500 },

  // Password strength
  strengthWrap: { marginTop: 6, marginBottom: 18 },
  strengthBar:  (w, color) => ({
    height: 4, width: w, background: color, borderRadius: 4,
    transition: 'width 0.35s, background 0.35s',
  }),
  strengthBg:   { height: 4, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  strengthTxt:  (color) => ({ fontSize: 12, color, fontWeight: 600 }),

  // Rule list
  rules: { fontSize: 12, color: '#9ca3af', lineHeight: 2, marginBottom: 20 },

  // Eye button
  eyeBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' },
}

// ─── Tab 1: Thông tin cá nhân ─────────────────────────────────────────────────

function ProfileTab({ admin, onRefresh }) {
  const { refreshAdmin } = useAuth()
  const [form, setForm]       = useState({
    email:    admin?.email    || '',
    fullName: admin?.fullName || '',
    phone:    admin?.phone    || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setForm({
      email:    admin?.email    || '',
      fullName: admin?.fullName || '',
      phone:    admin?.phone    || '',
    })
  }, [admin])

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }))
    setError(''); setSuccess('')
  }

  const validate = () => {
    if (!form.email) return 'Email không được để trống'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email không đúng định dạng'
    if (form.phone && !/^(\+?[0-9\s\-]{7,20})?$/.test(form.phone)) return 'Số điện thoại không hợp lệ'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    try {
      const res = await authService.updateProfile({
        email:    form.email,
        fullName: form.fullName.trim() || null,
        phone:    form.phone.trim()    || null,
      })
      const updated = res?.data || res
      refreshAdmin(updated)
      if (onRefresh) onRefresh((prev) => ({ ...prev, ...updated }))
      setSuccess('Cập nhật thông tin thành công!')
      toast.success('Đã lưu thông tin!')
    } catch (err) {
      setError(err?.response?.data?.message || 'Cập nhật thất bại, thử lại sau')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm({ email: admin?.email || '', fullName: admin?.fullName || '', phone: admin?.phone || '' })
    setError(''); setSuccess('')
  }

  return (
    <div style={S.body}>

      {/* ── Thông tin cơ bản ── */}
      <div style={S.section}>
        <div style={S.secTitle}>Thông tin tài khoản</div>
        <div style={S.grid2}>
          <div style={S.group}>
            <label style={S.label}>
              ID tài khoản
            </label>
            <input style={S.input(true)} value={`#${admin?.id || ''}`} disabled readOnly />
          </div>
          <div style={S.group}>
            <label style={S.label}>
              Tên đăng nhập
              <span style={S.roLock}>Không thể đổi</span>
            </label>
            <input style={S.input(true)} value={admin?.username || ''} disabled readOnly />
          </div>
        </div>
      </div>

      <div style={S.divider} />

      {/* ── Form chỉnh sửa ── */}
      <form onSubmit={handleSubmit}>
        <div style={S.section}>
          <div style={S.secTitle}>Thông tin cá nhân</div>

          <div style={S.group}>
            <label style={S.label}>Họ và tên</label>
            <input
              style={S.input(false)}
              value={form.fullName}
              onChange={set('fullName')}
              placeholder="Nguyễn Văn A"
              maxLength={100}
            />
          </div>

          <div style={S.grid2}>
            <div style={S.group}>
              <label style={S.label}>Email <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
              <input
                style={S.input(false)}
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div style={S.group}>
              <label style={S.label}>Số điện thoại</label>
              <input
                style={S.input(false)}
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="0912 345 678"
                maxLength={20}
              />
            </div>
          </div>
        </div>

        {error   && <p style={S.err}>{error}</p>}
        {success && <p style={S.succ}>{success}</p>}

        <div style={S.footer}>
          <button type="button" onClick={handleReset} style={S.btnSec}>Hủy</button>
          <button type="submit" disabled={loading} style={S.btnPri(loading)}>
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>

      <div style={S.divider} />

      {/* ── Metadata ── */}
      <div style={S.section}>
        <div style={S.secTitle}>Thông tin hệ thống</div>
        <div style={S.metaGrid}>
          <div style={S.metaItem}>
            <span style={S.metaKey}>Ngày tạo tài khoản</span>
            <span style={S.metaVal}>{formatDate(admin?.createdAt)}</span>
          </div>
          <div style={S.metaItem}>
            <span style={S.metaKey}>Trạng thái</span>
            <span style={{ ...S.metaVal, color: '#059669', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}

// ─── Tab 2: Bảo mật / Đổi mật khẩu ──────────────────────────────────────────

function SecurityTab() {
  const INIT = { oldPassword: '', newPassword: '', confirmPassword: '' }
  const [form, setForm]       = useState(INIT)
  const [show, setShow]       = useState({ old: false, new: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError(''); setSuccess('')
  }

  const validate = () => {
    if (!form.oldPassword) return 'Vui lòng nhập mật khẩu hiện tại'
    if (!form.newPassword) return 'Vui lòng nhập mật khẩu mới'
    if (form.newPassword.length < 6) return 'Mật khẩu mới phải ít nhất 6 ký tự'
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(form.newPassword)) return 'Mật khẩu mới phải chứa ít nhất 1 chữ và 1 số'
    if (form.newPassword !== form.confirmPassword) return 'Xác nhận mật khẩu không khớp'
    if (form.oldPassword === form.newPassword) return 'Mật khẩu mới không được trùng mật khẩu cũ'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      await authService.changePassword(form.oldPassword, form.newPassword, form.confirmPassword)
      setSuccess('Đổi mật khẩu thành công! Vui lòng dùng mật khẩu mới cho lần đăng nhập tiếp theo.')
      toast.success('Đổi mật khẩu thành công!')
      setForm(INIT)
    } catch (err) {
      setError(err?.response?.data?.message || 'Đổi mật khẩu thất bại, thử lại sau')
    } finally {
      setLoading(false)
    }
  }

  // Eye icon
  const Eye = ({ open, onToggle }) => (
    <button type="button" onClick={onToggle} style={S.eyeBtn}>
      {open
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  )

  const PwField = ({ name, label, showKey }) => (
    <div style={{ ...S.group, position: 'relative' }}>
      <label style={S.label}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          name={name}
          type={show[showKey] ? 'text' : 'password'}
          value={form[name]}
          onChange={handleChange}
          placeholder="••••••••"
          autoComplete={name === 'oldPassword' ? 'current-password' : 'new-password'}
          style={{ ...S.input(false), paddingRight: 42 }}
        />
        <Eye open={show[showKey]} onToggle={() => setShow((p) => ({ ...p, [showKey]: !p[showKey] }))} />
      </div>
    </div>
  )

  // Strength meter
  const strength = (() => {
    const p = form.newPassword
    if (!p) return null
    let s = 0
    if (p.length >= 6)  s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p)) s++
    if (/\d/.test(p))    s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    if (s <= 1) return { label: 'Yếu', color: '#ef4444', w: '25%' }
    if (s <= 2) return { label: 'Trung bình', color: '#f59e0b', w: '50%' }
    if (s <= 3) return { label: 'Khá', color: '#3b82f6', w: '75%' }
    return { label: 'Mạnh', color: '#10b981', w: '100%' }
  })()

  return (
    <div style={S.body}>

      <div style={S.section}>
        <div style={S.secTitle}>Đổi mật khẩu</div>

        <form onSubmit={handleSubmit}>
          <PwField name="oldPassword" label="Mật khẩu hiện tại" showKey="old" />

          <div style={S.divider} />

          <PwField name="newPassword" label="Mật khẩu mới" showKey="new" />

          {/* Strength bar */}
          {strength && (
            <div style={S.strengthWrap}>
              <div style={S.strengthBg}>
                <div style={S.strengthBar(strength.w, strength.color)} />
              </div>
              <div style={S.strengthTxt(strength.color)}>Độ mạnh: {strength.label}</div>
            </div>
          )}

          <PwField name="confirmPassword" label="Xác nhận mật khẩu mới" showKey="confirm" />

          {/* Rules */}
          <div style={S.rules}>
            <div>• Tối thiểu 6 ký tự</div>
            <div>• Phải chứa ít nhất 1 chữ cái và 1 chữ số</div>
            <div>• Không được trùng mật khẩu cũ</div>
          </div>

          {error   && <p style={S.err}>{error}</p>}
          {success && <p style={S.succ}>{success}</p>}

          <div style={S.footer}>
            <button type="button" onClick={() => { setForm(INIT); setError(''); setSuccess('') }} style={S.btnSec}>Hủy</button>
            <button type="submit" disabled={loading} style={S.btnPri(loading)}>
              {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      </div>

      {/* Security tips */}
      <div style={{ ...S.divider, marginTop: 0 }} />
      <div style={S.section}>
        <div style={S.secTitle}>Lưu ý bảo mật</div>
        <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.9 }}>
          <div>🔐 Không chia sẻ mật khẩu với bất kỳ ai</div>
          <div>🔄 Nên đổi mật khẩu định kỳ mỗi 3 tháng</div>
          <div>🚫 Tránh dùng thông tin cá nhân (tên, ngày sinh) làm mật khẩu</div>
        </div>
      </div>

    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { admin } = useAuth()
  const [tab, setTab]           = useState('profile')
  const [currentAdmin, setCurrentAdmin] = useState(admin)

  // Load fresh từ server
  useEffect(() => {
    authService.getProfile()
      .then((res) => {
        const info = res?.data || res
        setCurrentAdmin(info)
      })
      .catch(() => {})
  }, [])

  const displayName = currentAdmin?.fullName?.trim() || currentAdmin?.username || 'Admin'
  const initials    = getInitials(currentAdmin?.fullName, currentAdmin?.username)

  return (
    <div style={S.page}>

      {/* Header */}
      <div style={S.header}>
        <h1 style={S.title}>Tài khoản của tôi</h1>
        <p style={S.sub}>Quản lý thông tin cá nhân và bảo mật tài khoản</p>
      </div>

      {/* Avatar card */}
      <div style={S.avatarCard}>
        <div style={S.avatarRing}>{initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={S.avatarName}>{displayName}</div>
          <div style={S.avatarMeta}>
            <span>@{currentAdmin?.username}</span>
            {currentAdmin?.email && <span>{currentAdmin.email}</span>}
            {currentAdmin?.phone && <span>📞 {currentAdmin.phone}</span>}
          </div>
          <div style={{ marginTop: 10 }}>
            <span style={S.avatarBadge}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 12l2 2 4-4"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>

      {/* Tabs card */}
      <div style={S.card}>
        <div style={S.tabs}>
          <button style={S.tab(tab === 'profile')} onClick={() => setTab('profile')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Thông tin cá nhân
          </button>
          <button style={S.tab(tab === 'security')} onClick={() => setTab('security')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Bảo mật
          </button>
        </div>

        {tab === 'profile'  && <ProfileTab  admin={currentAdmin} onRefresh={setCurrentAdmin} />}
        {tab === 'security' && <SecurityTab />}
      </div>

    </div>
  )
}