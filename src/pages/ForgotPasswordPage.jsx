// src/pages/ForgotPasswordPage.jsx
// Luồng 2 bước:
//   B1 — nhập email → BE gửi OTP
//   B2 — nhập OTP + newPassword + confirmPassword → BE verify OTP → hash → lưu password_hash

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const STEP = { EMAIL: 'email', OTP: 'otp' }

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(STEP.EMAIL)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // B1
  const [email, setEmail] = useState('')

  // B2
  const [form, setForm] = useState({ otp: '', newPassword: '', confirmPassword: '' })

  // ─── B1: gửi OTP ─────────────────────────────────────────────────────────
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
    } finally {
      setLoading(false)
    }
  }

  // ─── B2: xác thực OTP + đặt mật khẩu mới ────────────────────────────────
  // FE gửi: email + otp + newPassword + confirmPassword (đúng luồng)
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.otp || !form.newPassword || !form.confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin'); return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp'); return
    }
    setLoading(true)
    try {
      await authService.resetPassword(email, form.otp, form.newPassword, form.confirmPassword)
      toast.success('Đặt lại mật khẩu thành công!')
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'OTP không hợp lệ hoặc đã hết hạn.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.grid} />
      <div style={s.card}>
        <div style={s.logoWrap}>
          <div style={s.logoMark}>J</div>
          <span style={s.logoText}>JobAdmin</span>
        </div>

        {/* ─── Step indicator ────────────────────────── */}
        <div style={s.steps}>
          <StepDot n={1} active={step === STEP.EMAIL} done={step === STEP.OTP} label="Nhập email" />
          <div style={s.stepLine} />
          <StepDot n={2} active={step === STEP.OTP} done={false} label="Xác thực OTP" />
        </div>

        {/* ─── B1: Email ─────────────────────────────── */}
        {step === STEP.EMAIL && (
          <>
            <h1 style={s.heading}>Quên mật khẩu</h1>
            <p style={s.sub}>Nhập email đăng ký để nhận mã OTP xác thực.</p>
            <form onSubmit={handleSendOtp} style={{ marginTop: 24 }}>
              <div style={s.field}>
                <label style={s.label}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email" style={s.input} />
              </div>
              {error && <p style={s.errorMsg}>{error}</p>}
              <button type="submit" disabled={loading} style={s.btn}>
                {loading ? <Spinner text="Đang gửi OTP..." /> : 'Gửi mã OTP'}
              </button>
            </form>
          </>
        )}

        {/* ─── B2: OTP + New Password ─────────────────── */}
        {step === STEP.OTP && (
          <>
            <h1 style={s.heading}>Đặt mật khẩu mới</h1>
            <p style={s.sub}>
              OTP đã gửi tới <strong style={{ color: 'var(--text-pri)' }}>{email}</strong>.
              Nhập OTP và mật khẩu mới bên dưới.
            </p>
            <form onSubmit={handleResetPassword} style={{ marginTop: 24 }}>
              <div style={s.field}>
                <label style={s.label}>Mã OTP (6 chữ số)</label>
                <input
                  name="otp"
                  value={form.otp}
                  onChange={(e) => setForm(p => ({ ...p, otp: e.target.value }))}
                  placeholder="123456"
                  maxLength={6}
                  inputMode="numeric"
                  style={{ ...s.input, letterSpacing: 6, fontSize: 20, textAlign: 'center' }}
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Mật khẩu mới</label>
                <input
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => setForm(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={s.input}
                />
                <span style={s.hint}>Tối thiểu 6 ký tự, gồm chữ và số</span>
              </div>
              <div style={s.field}>
                <label style={s.label}>Xác nhận mật khẩu mới</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={s.input}
                />
              </div>
              {error && <p style={s.errorMsg}>{error}</p>}
              <button type="submit" disabled={loading} style={s.btn}>
                {loading ? <Spinner text="Đang xử lý..." /> : 'Đặt lại mật khẩu'}
              </button>
              <button type="button" onClick={() => { setStep(STEP.EMAIL); setError('') }}
                style={s.btnSecondary}>
                Gửi lại OTP
              </button>
            </form>
          </>
        )}

        <p style={s.footer}>
          <Link to="/login" style={s.link}>← Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}

function StepDot({ n, active, done, label }) {
  const bg = done ? 'var(--accent)' : active ? 'var(--accent)' : 'var(--border)'
  const color = (done || active) ? '#000' : 'var(--text-mute)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
        {done ? '✓' : n}
      </div>
      <span style={{ fontSize: 11, color: active ? 'var(--accent)' : 'var(--text-mute)', fontWeight: active ? 600 : 400 }}>{label}</span>
    </div>
  )
}

function Spinner({ text }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" style={{ animation: 'spin 0.7s linear infinite' }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      {text}
    </span>
  )
}

const s = {
  page:       { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', position:'relative', overflow:'hidden', padding:20 },
  grid:       { position:'absolute', inset:0, backgroundImage:'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)', backgroundSize:'48px 48px', opacity:0.5, pointerEvents:'none' },
  card:       { position:'relative', width:'100%', maxWidth:420, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:20, padding:'36px 36px', boxShadow:'0 24px 80px rgba(0,0,0,.5)' },
  logoWrap:   { display:'flex', alignItems:'center', gap:10, marginBottom:24 },
  logoMark:   { width:36, height:36, borderRadius:10, background:'var(--accent)', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:800, fontSize:20 },
  logoText:   { fontFamily:'var(--font-head)', fontWeight:700, fontSize:20, color:'var(--text-pri)' },
  steps:      { display:'flex', alignItems:'flex-start', justifyContent:'center', gap:0, marginBottom:24 },
  stepLine:   { flex:1, height:2, background:'var(--border)', marginTop:14, maxWidth:60 },
  heading:    { fontFamily:'var(--font-head)', fontSize:24, fontWeight:800, color:'var(--text-pri)', lineHeight:1.1 },
  sub:        { fontSize:13, color:'var(--text-sec)', marginTop:6, lineHeight:1.5 },
  field:      { marginBottom:14 },
  label:      { display:'block', fontSize:13, fontWeight:600, color:'var(--text-sec)', marginBottom:6 },
  input:      { width:'100%', padding:'10px 14px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text-pri)', fontSize:14, outline:'none', boxSizing:'border-box' },
  hint:       { fontSize:11, color:'var(--text-mute)', marginTop:4, display:'block' },
  errorMsg:   { fontSize:13, color:'var(--red)', background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)', borderRadius:8, padding:'10px 14px', marginBottom:14 },
  btn:        { width:'100%', padding:'12px', background:'var(--accent)', color:'#000', border:'none', borderRadius:8, fontSize:15, fontWeight:700, fontFamily:'var(--font-body)', cursor:'pointer', marginTop:4 },
  btnSecondary:{ width:'100%', padding:'10px', background:'transparent', color:'var(--text-sec)', border:'1px solid var(--border)', borderRadius:8, fontSize:14, fontWeight:500, cursor:'pointer', marginTop:8 },
  footer:     { textAlign:'center', marginTop:20, fontSize:14 },
  link:       { color:'var(--accent)', fontWeight:600, textDecoration:'none' },
}
