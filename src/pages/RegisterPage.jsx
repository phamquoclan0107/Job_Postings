import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const S = {
  page:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: 20 },
  card:  { width: '100%', maxWidth: 420, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '40px 36px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' },
  logo:  { fontWeight: 800, fontSize: 20, color: '#111827', marginBottom: 28, display: 'block' },
  h1:    { fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 6px' },
  sub:   { fontSize: 13, color: '#6b7280', marginBottom: 28 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#111827', background: '#fff', boxSizing: 'border-box', outline: 'none' },
  btn:   { width: '100%', padding: '12px', background: '#111827', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  err:   { fontSize: 13, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16 },
  link:  { color: '#111827', fontWeight: 600, textDecoration: 'none' },
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin'); return
    }
    if (form.password !== form.confirmPassword) { setError('Mật khẩu xác nhận không khớp'); return }
    setLoading(true)
    try {
      await authService.register(form.username, form.email, form.password, form.confirmPassword)
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'username', label: 'Tên đăng nhập', type: 'text', placeholder: 'admin123', autoComplete: 'username' },
    { name: 'email',    label: 'Email',          type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
    { name: 'password', label: 'Mật khẩu',       type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
    { name: 'confirmPassword', label: 'Xác nhận mật khẩu', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
  ]

  return (
    <div style={S.page}>
      <div style={S.card}>
        <span style={S.logo}>FreMed Admin</span>
        <h1 style={S.h1}>Đăng ký tài khoản</h1>
        <p style={S.sub}>Tạo tài khoản để quản lý tin tuyển dụng</p>

        <form onSubmit={handleSubmit}>
          {fields.map(({ name, label, type, placeholder, autoComplete }) => (
            <div key={name} style={{ marginBottom: 16 }}>
              <label style={S.label}>{label}</label>
              <input name={name} type={type} value={form[name]} onChange={handleChange}
                placeholder={placeholder} autoComplete={autoComplete} style={S.input} />
            </div>
          ))}

          {error && <p style={S.err}>{error}</p>}

          <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={S.link}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
