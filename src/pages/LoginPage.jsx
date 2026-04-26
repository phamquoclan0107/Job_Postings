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

  if (isLoggedIn) { navigate('/jobs', { replace: true }); return null }

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.password) { setError('Vui lòng nhập đầy đủ thông tin'); return }
    setLoading(true)
    try {
      await login(form.username, form.password)
      toast.success('Đăng nhập thành công!')
      navigate('/jobs', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Sai tài khoản hoặc mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden p-5">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
      <div className="relative w-full max-w-[400px] bg-bg-card border border-border rounded-xl p-10 shadow-card">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-9 h-9 rounded-[10px] bg-accent text-black flex items-center justify-center font-head font-extrabold text-xl">J</div>
          <span className="font-head font-bold text-xl text-text-pri">JobAdmin</span>
        </div>

        <h1 className="font-head text-[28px] font-extrabold text-text-pri leading-tight">Login</h1>
        <p className="text-sm text-text-sec mt-1.5">Quản lý tin tuyển dụng của bạn</p>

        <form onSubmit={handleSubmit} className="mt-7">
          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-text-sec mb-1.5">Tên đăng nhập</label>
            <input name="username" value={form.username} onChange={handleChange}
              placeholder="admin" autoComplete="username"
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-lg text-text-pri text-sm outline-none transition-colors box-border" />
          </div>
          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-text-sec mb-1.5">Mật khẩu</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="••••••••" autoComplete="current-password"
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-lg text-text-pri text-sm outline-none transition-colors box-border" />
          </div>

          {error && (
            <p className="text-[13px] text-red bg-red/[.08] border border-red/20 rounded-lg px-3.5 py-2.5 mb-4">{error}</p>
          )}

          <div className="text-right mb-3 -mt-1">
            <Link to="/forgot-password" className="text-accent font-semibold text-[13px] no-underline">Quên mật khẩu?</Link>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-accent text-black border-0 rounded-lg text-[15px] font-bold cursor-pointer mt-1 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? <SpinnerText text="Đang xử lý..." /> : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-text-sec">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-accent font-semibold text-[13px] no-underline">Đăng ký ngay</Link>
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