// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const S = {
  page:      { maxWidth: 640, margin: '0 auto' },
  title:     { fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 4px' },
  sub:       { fontSize: 14, color: '#6b7280', margin: '0 0 32px' },
  card:      { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' },
  tabs:      { display: 'flex', borderBottom: '1px solid #e5e7eb' },
  tab:       (active) => ({
    padding: '14px 24px', fontSize: 14, fontWeight: active ? 600 : 500,
    color: active ? '#111827' : '#6b7280',
    borderBottom: active ? '2px solid #111827' : '2px solid transparent',
    background: 'none', border: 'none', cursor: 'pointer', marginBottom: -1,
    transition: 'color 0.15s',
  }),
  body:      { padding: 32 },
  avatar:    { width: 72, height: 72, borderRadius: 16, background: '#111827', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, marginBottom: 24, userSelect: 'none' },
  row:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  group:     { marginBottom: 16 },
  label:     { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input:     (disabled) => ({
    width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8,
    fontSize: 14, color: disabled ? '#9ca3af' : '#111827',
    background: disabled ? '#f9fafb' : '#fff', boxSizing: 'border-box', outline: 'none',
  }),
  badge:     { display: 'inline-block', fontSize: 12, fontWeight: 600, color: '#059669', background: '#d1fae5', borderRadius: 6, padding: '2px 10px', marginLeft: 8 },
  footer:    { display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16, borderTop: '1px solid #f3f4f6', marginTop: 8 },
  btnPri:    (loading) => ({
    padding: '10px 24px', background: '#111827', color: '#fff', border: 'none',
    borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
  }),
  btnSec:    { padding: '10px 24px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  err:       { fontSize: 13, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16 },
  info:      { fontSize: 13, color: '#374151', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', marginBottom: 16 },
  divider:   { height: 1, background: '#f3f4f6', margin: '24px 0' },
  metaRow:   { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280', padding: '8px 0' },
  metaLabel: { fontWeight: 500, color: '#374151' },
}

function formatDate(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
}

// ── Tab 1: Thông tin tài khoản ────────────────────────────────────────────────
function ProfileTab({ admin, onRefresh }) {
  const { refreshAdmin } = useAuth()
  const [form, setForm]       = useState({ email: admin?.email || '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  // Sync khi admin thay đổi
  useEffect(() => {
    setForm({ email: admin?.email || '' })
  }, [admin])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!form.email) { setError('Email không được để trống'); return }
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailReg.test(form.email)) { setError('Email không đúng định dạng'); return }

    setLoading(true)
    try {
      const res = await authService.updateProfile({ email: form.email })
      const updated = res.data || res
      refreshAdmin(updated)
      if (onRefresh) onRefresh(updated)
      setSuccess('Cập nhật thông tin thành công!')
      toast.success('Cập nhật thành công!')
    } catch (err) {
      setError(err?.response?.data?.message || 'Cập nhật thất bại, thử lại sau')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setForm({ email: admin?.email || '' })
    setError(''); setSuccess('')
  }

  return (
    <div style={S.body}>
      {/* Avatar */}
      <div style={S.avatar}>{admin?.username?.[0]?.toUpperCase() || 'A'}</div>

      {/* Readonly info */}
      <div style={S.row}>
        <div style={S.group}>
          <label style={S.label}>
            ID tài khoản
          </label>
          <input style={S.input(true)} value={admin?.id || ''} disabled readOnly />
        </div>
        <div style={S.group}>
          <label style={S.label}>
            Tên đăng nhập
            <span style={S.badge}>Không thể đổi</span>
          </label>
          <input style={S.input(true)} value={admin?.username || ''} disabled readOnly />
        </div>
      </div>

      <div style={S.divider} />

      {/* Editable form */}
      <form onSubmit={handleSubmit}>
        <div style={S.group}>
          <label style={S.label}>Email</label>
          <input
            style={S.input(false)}
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="your@email.com"
            autoComplete="email"
          />
        </div>

        {error   && <p style={S.err}>{error}</p>}
        {success && <p style={S.info}>{success}</p>}

        <div style={S.footer}>
          <button type="button" onClick={reset} style={S.btnSec}>Hủy</button>
          <button type="submit" disabled={loading} style={S.btnPri(loading)}>
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>

      <div style={S.divider} />

      {/* Metadata */}
      <div>
        <div style={S.metaRow}>
          <span style={S.metaLabel}>Ngày tạo tài khoản</span>
          <span>{formatDate(admin?.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

// ── Tab 2: Đổi mật khẩu ──────────────────────────────────────────────────────
function ChangePasswordTab() {
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
    if (!form.oldPassword) return 'Vui lòng nhập mật khẩu cũ'
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
      setSuccess('Đổi mật khẩu thành công!')
      toast.success('Đổi mật khẩu thành công!')
      setForm(INIT)
    } catch (err) {
      setError(err?.response?.data?.message || 'Đổi mật khẩu thất bại, thử lại sau')
    } finally {
      setLoading(false)
    }
  }

  const EyeIcon = ({ show, onClick }) => (
    <button type="button" onClick={onClick}
      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
      {show
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  )

  const PasswordField = ({ name, label, showKey }) => (
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
          style={{ ...S.input(false), paddingRight: 40 }}
        />
        <EyeIcon show={show[showKey]} onClick={() => setShow((p) => ({ ...p, [showKey]: !p[showKey] }))} />
      </div>
    </div>
  )

  // Strength indicator
  const strength = (() => {
    const p = form.newPassword
    if (!p) return null
    let score = 0
    if (p.length >= 6)  score++
    if (p.length >= 10) score++
    if (/[A-Z]/.test(p)) score++
    if (/\d/.test(p))    score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    if (score <= 1) return { label: 'Yếu', color: '#ef4444', w: '25%' }
    if (score <= 2) return { label: 'Trung bình', color: '#f59e0b', w: '50%' }
    if (score <= 3) return { label: 'Khá', color: '#3b82f6', w: '75%' }
    return { label: 'Mạnh', color: '#10b981', w: '100%' }
  })()

  return (
    <div style={S.body}>
      <form onSubmit={handleSubmit}>
        <PasswordField name="oldPassword"      label="Mật khẩu hiện tại" showKey="old" />
        <div style={S.divider} />
        <PasswordField name="newPassword"      label="Mật khẩu mới"      showKey="new" />

        {/* Strength bar */}
        {strength && (
          <div style={{ marginTop: -8, marginBottom: 16 }}>
            <div style={{ height: 4, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: strength.w, background: strength.color, borderRadius: 4, transition: 'width 0.3s, background 0.3s' }} />
            </div>
            <div style={{ fontSize: 12, color: strength.color, marginTop: 4, fontWeight: 500 }}>Độ mạnh: {strength.label}</div>
          </div>
        )}

        <PasswordField name="confirmPassword" label="Xác nhận mật khẩu mới" showKey="confirm" />

        {/* Rules */}
        <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 20, lineHeight: 1.7 }}>
          <div>• Tối thiểu 6 ký tự</div>
          <div>• Phải chứa ít nhất 1 chữ cái và 1 chữ số</div>
          <div>• Không được trùng với mật khẩu cũ</div>
        </div>

        {error   && <p style={S.err}>{error}</p>}
        {success && <p style={S.info}>{success}</p>}

        <div style={S.footer}>
          <button type="button" onClick={() => { setForm(INIT); setError(''); setSuccess('') }} style={S.btnSec}>Hủy</button>
          <button type="submit" disabled={loading} style={S.btnPri(loading)}>
            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { admin } = useAuth()
  const [tab, setTab]           = useState('profile')
  const [currentAdmin, setCurrentAdmin] = useState(admin)

  // Reload fresh data từ server khi vào trang
  useEffect(() => {
    authService.getProfile()
      .then((res) => {
        const info = res.data || res
        setCurrentAdmin(info)
      })
      .catch(() => {}) // dùng data từ localStorage nếu lỗi
  }, [])

  return (
    <div style={S.page}>
      <h1 style={S.title}>Tài khoản của tôi</h1>
      <p style={S.sub}>Quản lý thông tin cá nhân và bảo mật tài khoản</p>

      <div style={S.card}>
        {/* Tabs */}
        <div style={S.tabs}>
          <button style={S.tab(tab === 'profile')}  onClick={() => setTab('profile')}>
            Thông tin tài khoản
          </button>
          <button style={S.tab(tab === 'password')} onClick={() => setTab('password')}>
            Đổi mật khẩu
          </button>
        </div>

        {/* Content */}
        {tab === 'profile'  && <ProfileTab  admin={currentAdmin} onRefresh={setCurrentAdmin} />}
        {tab === 'password' && <ChangePasswordTab />}
      </div>
    </div>
  )
}