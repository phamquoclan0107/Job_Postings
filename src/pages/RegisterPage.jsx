import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

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

  const inputCls = 'w-full px-3.5 py-2.5 bg-bg border border-border rounded-lg text-text-pri text-sm outline-none box-border'

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden p-5">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
      <div className="relative w-full max-w-[420px] bg-bg-card border border-border rounded-xl p-9 shadow-card">
        <div className="flex items-center gap-2.5 mb-[22px]">
          <div className="w-9 h-9 rounded-[10px] bg-accent text-black flex items-center justify-center font-head font-extrabold text-xl">J</div>
          <span className="font-head font-bold text-xl text-text-pri">JobAdmin</span>
        </div>
        <h1 className="font-head text-[26px] font-extrabold text-text-pri leading-tight">Đăng ký tài khoản</h1>
        <p className="text-sm text-text-sec mt-1.5">Tạo tài khoản để quản lý tin tuyển dụng</p>

        <form onSubmit={handleSubmit} className="mt-6">
          {[
            { name: 'username', label: 'Tên đăng nhập', type: 'text', placeholder: 'admin123', autoComplete: 'username' },
            { name: 'email',    label: 'Email',          type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
          ].map(({ name, label, type, placeholder, autoComplete }) => (
            <div key={name} className="mb-3.5">
              <label className="block text-[13px] font-semibold text-text-sec mb-1.5">{label}</label>
              <input name={name} type={type} value={form[name]} onChange={handleChange}
                placeholder={placeholder} autoComplete={autoComplete} className={inputCls} />
            </div>
          ))}

          <div className="mb-3.5">
            <label className="block text-[13px] font-semibold text-text-sec mb-1.5">Mật khẩu</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="••••••••" autoComplete="new-password" className={inputCls} />
            <span className="text-[11px] text-text-mute mt-1 block">Tối thiểu 6 ký tự, gồm chữ và số</span>
          </div>

          <div className="mb-3.5">
            <label className="block text-[13px] font-semibold text-text-sec mb-1.5">Xác nhận mật khẩu</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
              placeholder="••••••••" autoComplete="new-password" className={inputCls} />
          </div>

          {error && (
            <p className="text-[13px] text-red bg-red/[.08] border border-red/20 rounded-lg px-3.5 py-2.5 mb-3.5">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-accent text-black border-0 rounded-lg text-[15px] font-bold cursor-pointer mt-1 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? <SpinnerText text="Đang xử lý..." /> : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-text-sec">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-accent font-semibold no-underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}

function SpinnerText({ text }) {
  return (
    <span className="flex items-center gap-2 justify-center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      {text}
    </span>
  )
}