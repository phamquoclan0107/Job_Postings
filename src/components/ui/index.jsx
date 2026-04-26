import React from 'react'

/* ── Spinner ── */
export function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" className="spin">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

/* ── Button ── */
export function Button({ children, variant = 'primary', size = 'md', loading = false, disabled, className = '', ...props }) {
  const isDisabled = disabled || loading
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-[18px] py-[9px] text-sm', lg: 'px-6 py-3 text-[15px]' }
  const variants = {
    primary: 'bg-accent text-white hover:opacity-90',
    ghost: 'bg-transparent text-text-sec border border-transparent hover:bg-bg hover:text-text-pri',
    danger:  'bg-red/15 text-red border border-red/30',
    success: 'bg-green/15 text-green border border-green/30',
  }
  return (
    <button disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-sm font-semibold transition-all duration-[180ms] whitespace-nowrap
        ${sizes[size]} ${variants[variant]} ${isDisabled ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}>
      {loading && <Spinner size={14} />}
      {children}
    </button>
  )
}

/* ── Badge ── */
export function Badge({ children, color = 'var(--text-mute)', bg, style }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide"
      style={{ background: bg || `${color}20`, color, border: `1px solid ${color}40`, ...style }}>
      {children}
    </span>
  )
}

/* ── PageTitle ── */
export function PageTitle({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        <h1 className="font-head text-[26px] font-bold text-text-pri leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-text-sec mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

/* ── Card ── */
export function Card({ children, className = '', style }) {
  return (
    <div className={`bg-bg-card border border-border rounded-lg overflow-hidden ${className}`} style={style}>
      {children}
    </div>
  )
}

/* ── EmptyState ── */
export function EmptyState({ message = 'Không có dữ liệu' }) {
  return (
    <div className="text-center py-16 px-5 text-text-mute">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40 mb-3 mx-auto">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  )
}

/* ── Pagination ── */
export function Pagination({ page, totalPages, totalElements, size, onPageChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i)
  const from = page * size + 1
  const to = Math.min((page + 1) * size, totalElements)
  const btnBase = 'w-8 h-8 rounded-[6px] border border-border text-sm cursor-pointer transition-all duration-[180ms]'
  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-border flex-wrap gap-3">
      <span className="text-[13px] text-text-mute">Hiển thị {from}–{to} / {totalElements} kết quả</span>
      <div className="flex gap-1">
        <button className={`${btnBase} bg-transparent text-text-sec disabled:opacity-40 disabled:cursor-not-allowed`}
          disabled={page === 0} onClick={() => onPageChange(page - 1)}>‹</button>
        {pages.map((p) => (
          <button key={p}
            className={`${btnBase} ${p === page ? 'bg-accent text-black font-bold' : 'bg-transparent text-text-sec'}`}
            onClick={() => onPageChange(p)}>{p + 1}</button>
        ))}
        <button className={`${btnBase} bg-transparent text-text-sec disabled:opacity-40 disabled:cursor-not-allowed`}
          disabled={page === totalPages - 1} onClick={() => onPageChange(page + 1)}>›</button>
      </div>
    </div>
  )
}

/* ── FormField ── */
export function FormField({ label, error, children, required, hint }) {
  return (
    <div className="mb-[18px]">
      {label && (
        <label className="block text-[13px] font-semibold text-text-sec mb-1.5">
          {label} {required && <span className="text-accent">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[11px] text-text-mute mt-1">{hint}</p>}
      {error && <p className="text-xs text-red mt-1">{error}</p>}
    </div>
  )
}

/* ── Form inputs — dùng forwardRef để react-hook-form truyền ref được ── */
const inputBase = 'w-full px-3 py-[9px] bg-bg border rounded-sm text-text-pri text-sm transition-colors duration-[150ms] focus:outline-none'

export const Input = React.forwardRef(function Input({ error, className = '', ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`${inputBase} ${error ? 'border-red' : 'border-border'} ${className}`}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export const Textarea = React.forwardRef(function Textarea({ error, className = '', ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`${inputBase} ${error ? 'border-red' : 'border-border'} resize-y min-h-[100px] ${className}`}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef(function Select({ error, children, className = '', ...props }, ref) {
  return (
    <select
      ref={ref}
      className={`${inputBase} ${error ? 'border-red' : 'border-border'} cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  )
})
Select.displayName = 'Select'

/* ── ConfirmModal ── */
export function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]" onClick={onCancel}>
      <div className="bg-bg-card border border-border rounded-lg p-7 max-w-[420px] w-[90%]" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-head text-[18px] font-bold mb-2.5">{title}</h3>
        <p className="text-text-sec text-sm mb-6">{message}</p>
        <div className="flex gap-2.5 justify-end">
          <Button variant="ghost" onClick={onCancel}>Hủy</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>Xác nhận xóa</Button>
        </div>
      </div>
    </div>
  )
}