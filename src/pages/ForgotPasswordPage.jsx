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

  const inputCls = 'w-full px-3.5 py-2.5 bg-bg border border-border rounded-lg text-text-pri text-sm outline-none box-border'

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden p-5">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
      <div className="relative w-full max-w-[420px] bg-bg-card border border-border rounded-xl p-9 shadow-card">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-[10px] bg-accent text-black flex items-center justify-center font-head font-extrabold text-xl">J</div>
          <span className="font-head font-bold text-xl text-text-pri">JobAdmin</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-start justify-center gap-0 mb-6">
          <StepDot n={1} active={step === STEP.EMAIL} done={step === STEP.OTP} label="Nhập email" />
          <div className="flex-1 h-0.5 bg-border mt-3.5 max-w-[60px]" />
          <StepDot n={2} active={step === STEP.OTP} done={false} label="Xác thực OTP" />
        </div>

        {/* Step 1 */}
        {step === STEP.EMAIL && (
          <>
            <h1 className="font-head text-2xl font-extrabold text-text-pri leading-tight">Quên mật khẩu</h1>
            <p className="text-[13px] text-text-sec mt-1.5 leading-relaxed">Nhập email đăng ký để nhận mã OTP xác thực.</p>
            <form onSubmit={handleSendOtp} className="mt-6">
              <div className="mb-3.5">
                <label className="block text-[13px] font-semibold text-text-sec mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email" className={inputCls} />
              </div>
              {error && <p className="text-[13px] text-red bg-red/[.08] border border-red/20 rounded-lg px-3.5 py-2.5 mb-3.5">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-accent text-black border-0 rounded-lg text-[15px] font-bold cursor-pointer mt-1 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? <SpinnerText text="Đang gửi OTP..." /> : 'Gửi mã OTP'}
              </button>
            </form>
          </>
        )}

        {/* Step 2 */}
        {step === STEP.OTP && (
          <>
            <h1 className="font-head text-2xl font-extrabold text-text-pri leading-tight">Đặt mật khẩu mới</h1>
            <p className="text-[13px] text-text-sec mt-1.5 leading-relaxed">
              OTP đã gửi tới <strong className="text-text-pri">{email}</strong>. Nhập OTP và mật khẩu mới bên dưới.
            </p>
            <form onSubmit={handleResetPassword} className="mt-6">
              <div className="mb-3.5">
                <label className="block text-[13px] font-semibold text-text-sec mb-1.5">Mã OTP (6 chữ số)</label>
                <input name="otp" value={form.otp} onChange={(e) => setForm(p => ({ ...p, otp: e.target.value }))}
                  placeholder="123456" maxLength={6} inputMode="numeric"
                  className={`${inputCls} tracking-[6px] text-xl text-center`} />
              </div>
              <div className="mb-3.5">
                <label className="block text-[13px] font-semibold text-text-sec mb-1.5">Mật khẩu mới</label>
                <input name="newPassword" type="password" value={form.newPassword}
                  onChange={(e) => setForm(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="••••••••" autoComplete="new-password" className={inputCls} />
                <span className="text-[11px] text-text-mute mt-1 block">Tối thiểu 6 ký tự, gồm chữ và số</span>
              </div>
              <div className="mb-3.5">
                <label className="block text-[13px] font-semibold text-text-sec mb-1.5">Xác nhận mật khẩu mới</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword}
                  onChange={(e) => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="••••••••" autoComplete="new-password" className={inputCls} />
              </div>
              {error && <p className="text-[13px] text-red bg-red/[.08] border border-red/20 rounded-lg px-3.5 py-2.5 mb-3.5">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-accent text-black border-0 rounded-lg text-[15px] font-bold cursor-pointer mt-1 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? <SpinnerText text="Đang xử lý..." /> : 'Đặt lại mật khẩu'}
              </button>
              <button type="button" onClick={() => { setStep(STEP.EMAIL); setError('') }}
                className="w-full py-2.5 bg-transparent text-text-sec border border-border rounded-lg text-sm font-medium cursor-pointer mt-2">
                Gửi lại OTP
              </button>
            </form>
          </>
        )}

        <p className="text-center mt-5 text-sm">
          <Link to="/login" className="text-accent font-semibold no-underline">← Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}

function StepDot({ n, active, done, label }) {
  const isHighlit = done || active
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold ${isHighlit ? 'bg-accent text-black' : 'bg-border text-text-mute'}`}>
        {done ? '✓' : n}
      </div>
      <span className={`text-[11px] font-${active ? 'semibold' : 'normal'} ${active ? 'text-accent' : 'text-text-mute'}`}>{label}</span>
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