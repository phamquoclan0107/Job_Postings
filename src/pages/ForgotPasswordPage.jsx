import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const STEP = { EMAIL: 'email', OTP: 'otp' }

const S = {
  page:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: 20 },
  card:  { width: '100%', maxWidth: 420, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '40px 36px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' },
  logo:  { fontWeight: 800, fontSize: 20, color: '#111827', marginBottom: 28, display: 'block' },
  h1:    { fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 6px' },
  sub:   { fontSize: 13, color: '#6b7280', marginBottom: 28, lineHeight: 1.6 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#111827', background: '#fff', boxSizing: 'border-box', outline: 'none' },
  btn:   { width: '100%', padding: '12px', background: '#111827', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  btnSec:{ width: '100%', padding: '11px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 8 },
  err:   { fontSize: 13, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16 },
  link:  { color: '#111827', fontWeight: 600, textDecoration: 'none' },
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(STEP.EMAIL)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [email, setEmail]     = useState('')
  const [form, setForm]       = useState({ otp: '', newPassword: '', confirmPassword: '' })

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) { setError('Vui lòng nhập email'); return }
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      toast.success('OTP đã được gửi! Kiểm tra hộp thư của bạn.')
      setStep(STEP.OTP)
    } catch (err) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra. Thử lại sau.')
    } finally { setLoading(false) }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.otp || !form.newPassword || !form.confirmPassword) { setError('Vui lòng nhập đầy đủ thông tin'); return }
    if (form.newPassword !== form.confirmPassword) { setError('Mật khẩu xác nhận không khớp'); return }
    setLoading(true)
    try {
      await authService.resetPassword(email, form.otp, form.newPassword, form.confirmPassword)
      toast.success('Đặt lại mật khẩu thành công!')
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'OTP không hợp lệ hoặc đã hết hạn.')
    } finally { setLoading(false) }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <span style={S.logo}>FreMed Admin</span>

        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, gap: 8 }}>
          {['Nhập email', 'Xác thực OTP'].map((label, i) => {
            const n = i + 1
            const done = (i === 0 && step === STEP.OTP)
            const active = (i === 0 && step === STEP.EMAIL) || (i === 1 && step === STEP.OTP)
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <div style={{ width: 32, height: 1, background: '#e5e7eb' }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: active || done ? '#111827' : '#f3f4f6', color: active || done ? '#fff' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {done ? '✓' : n}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? '#111827' : '#9ca3af' }}>{label}</span>
                </div>
              </div>
            )
          })}
        </div>

        {step === STEP.EMAIL && (
          <>
            <h1 style={S.h1}>Quên mật khẩu</h1>
            <p style={S.sub}>Nhập email đăng ký để nhận mã OTP xác thực.</p>
            <form onSubmit={handleSendOtp}>
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email" style={S.input} />
              </div>
              {error && <p style={S.err}>{error}</p>}
              <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Đang gửi OTP...' : 'Gửi mã OTP'}
              </button>
            </form>
          </>
        )}

        {step === STEP.OTP && (
          <>
            <h1 style={S.h1}>Đặt mật khẩu mới</h1>
            <p style={S.sub}>OTP đã gửi tới <strong style={{ color: '#111827' }}>{email}</strong>. Nhập OTP và mật khẩu mới bên dưới.</p>
            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Mã OTP (6 chữ số)</label>
                <input value={form.otp} onChange={(e) => setForm(p => ({ ...p, otp: e.target.value }))}
                  placeholder="123456" maxLength={6} inputMode="numeric"
                  style={{ ...S.input, letterSpacing: '0.3em', textAlign: 'center', fontSize: 20 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Mật khẩu mới</label>
                <input type="password" value={form.newPassword}
                  onChange={(e) => setForm(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="••••••••" autoComplete="new-password" style={S.input} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Xác nhận mật khẩu mới</label>
                <input type="password" value={form.confirmPassword}
                  onChange={(e) => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="••••••••" autoComplete="new-password" style={S.input} />
              </div>
              {error && <p style={S.err}>{error}</p>}
              <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
              <button type="button" onClick={() => { setStep(STEP.EMAIL); setError('') }} style={S.btnSec}>
                Gửi lại OTP
              </button>
            </form>
          </>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
          <Link to="/login" style={{ ...S.link, color: '#6b7280' }}>← Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
