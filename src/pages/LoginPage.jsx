// src/pages/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  if (isLoggedIn) {
    navigate('/jobs', { replace: true })
    return null
  }

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.password) {
      setError('Vui lòng nhập đầy đủ thông tin')
      return
    }
    setLoading(true)
    try {
      await login(form.username, form.password)
      toast.success('Đăng nhập thành công!')
      navigate('/jobs', { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Sai tài khoản hoặc mật khẩu'
      setError(msg)
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

        <h1 style={s.heading}>Đăng nhập</h1>
        <p style={s.sub}>Quản lý tin tuyển dụng của bạn</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
          <div style={s.field}>
            <label style={s.label}>Tên đăng nhập</label>
            <input name="username" value={form.username} onChange={handleChange}
              placeholder="admin" autoComplete="username" style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Mật khẩu</label>
            <input name="password" type="password" value={form.password}
              onChange={handleChange} placeholder="••••••••"
              autoComplete="current-password" style={s.input} />
          </div>

          {error && <p style={s.errorMsg}>{error}</p>}

          {/* Link quên mật khẩu */}
          <div style={{ textAlign: 'right', marginBottom: 12, marginTop: -4 }}>
            <Link to="/forgot-password" style={s.link}>Quên mật khẩu?</Link>
          </div>

          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? <Spinner text="Đang xử lý..." /> : 'Đăng nhập'}
          </button>
        </form>

        <p style={s.footer}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={s.link}>Đăng ký ngay</Link>
        </p>
      </div>
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
  page:    { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', position:'relative', overflow:'hidden', padding:20 },
  grid:    { position:'absolute', inset:0, backgroundImage:'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)', backgroundSize:'48px 48px', opacity:0.5, pointerEvents:'none' },
  card:    { position:'relative', width:'100%', maxWidth:400, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:20, padding:'40px 36px', boxShadow:'0 24px 80px rgba(0,0,0,.5)' },
  logoWrap:{ display:'flex', alignItems:'center', gap:10, marginBottom:28 },
  logoMark:{ width:36, height:36, borderRadius:10, background:'var(--accent)', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:800, fontSize:20 },
  logoText:{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:20, color:'var(--text-pri)' },
  heading: { fontFamily:'var(--font-head)', fontSize:28, fontWeight:800, color:'var(--text-pri)', lineHeight:1.1 },
  sub:     { fontSize:14, color:'var(--text-sec)', marginTop:6 },
  field:   { marginBottom:16 },
  label:   { display:'block', fontSize:13, fontWeight:600, color:'var(--text-sec)', marginBottom:6 },
  input:   { width:'100%', padding:'10px 14px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text-pri)', fontSize:14, outline:'none', boxSizing:'border-box', transition:'border-color 0.15s' },
  errorMsg:{ fontSize:13, color:'var(--red)', background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)', borderRadius:8, padding:'10px 14px', marginBottom:16 },
  btn:     { width:'100%', padding:'12px', background:'var(--accent)', color:'#000', border:'none', borderRadius:8, fontSize:15, fontWeight:700, fontFamily:'var(--font-body)', cursor:'pointer', marginTop:4, transition:'opacity 0.15s' },
  footer:  { textAlign:'center', marginTop:20, fontSize:14, color:'var(--text-sec)' },
  link:    { color:'var(--accent)', fontWeight:600, textDecoration:'none', fontSize:13 },
}
