// src/components/ui/index.jsx
import React from 'react'

/* ── Button ───────────────────────────────────────────── */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  style,
  ...props
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'var(--transition)',
    whiteSpace: 'nowrap',
    opacity: disabled || loading ? 0.55 : 1,
  }

  const sizes = {
    sm: { padding: '6px 12px', fontSize: 12 },
    md: { padding: '9px 18px', fontSize: 14 },
    lg: { padding: '12px 24px', fontSize: 15 },
  }

  const variants = {
    primary:  { background: 'var(--accent)',       color: '#000' },
    ghost:    { background: 'transparent',          color: 'var(--text-sec)', border: '1px solid var(--border-light)' },
    danger:   { background: 'rgba(239,68,68,.15)', color: 'var(--red)',      border: '1px solid rgba(239,68,68,.3)' },
    success:  { background: 'rgba(62,207,142,.15)',color: 'var(--green)',    border: '1px solid rgba(62,207,142,.3)' },
  }

  return (
    <button
      disabled={disabled || loading}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      {...props}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  )
}

/* ── Badge ────────────────────────────────────────────── */
export function Badge({ children, color = 'var(--text-mute)', bg, style }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.03em',
        background: bg || `${color}20`,
        color,
        border: `1px solid ${color}40`,
        ...style,
      }}
    >
      {children}
    </span>
  )
}

/* ── Spinner ──────────────────────────────────────────── */
export function Spinner({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      style={{ animation: 'spin 0.7s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

/* ── PageTitle ────────────────────────────────────────── */
export function PageTitle({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--text-pri)', lineHeight: 1.2 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 14, color: 'var(--text-sec)', marginTop: 4 }}>{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

/* ── Card ─────────────────────────────────────────────── */
export function Card({ children, style }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ── EmptyState ───────────────────────────────────────── */
export function EmptyState({ message = 'Không có dữ liệu' }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-mute)' }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4, marginBottom: 12 }}>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      </svg>
      <p style={{ fontSize: 14 }}>{message}</p>
    </div>
  )
}

/* ── Pagination ───────────────────────────────────────── */
export function Pagination({ page, totalPages, totalElements, size, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i)
  const from  = page * size + 1
  const to    = Math.min((page + 1) * size, totalElements)

  return (
    <div style={paginStyles.wrap}>
      <span style={paginStyles.info}>
        Hiển thị {from}–{to} / {totalElements} kết quả
      </span>
      <div style={paginStyles.pages}>
        <button
          style={paginStyles.btn}
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >‹</button>

        {pages.map((p) => (
          <button
            key={p}
            style={{
              ...paginStyles.btn,
              background: p === page ? 'var(--accent)' : 'transparent',
              color:      p === page ? '#000' : 'var(--text-sec)',
              fontWeight: p === page ? 700 : 400,
            }}
            onClick={() => onPageChange(p)}
          >
            {p + 1}
          </button>
        ))}

        <button
          style={paginStyles.btn}
          disabled={page === totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >›</button>
      </div>
    </div>
  )
}

const paginStyles = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderTop: '1px solid var(--border)',
    flexWrap: 'wrap',
    gap: 12,
  },
  info: { fontSize: 13, color: 'var(--text-mute)' },
  pages: { display: 'flex', gap: 4 },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-sec)',
    cursor: 'pointer',
    fontSize: 14,
    transition: 'var(--transition)',
  },
}

/* ── FormField ────────────────────────────────────────── */
export function FormField({ label, error, children, required, hint }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {label && (
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-sec)', marginBottom: 6 }}>
          {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 4 }}>{hint}</p>}
      {error && <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>{error}</p>}
    </div>
  )
}

const inputBase = {
  width: '100%',
  padding: '9px 12px',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-pri)',
  fontSize: 14,
  transition: 'border-color 0.15s',
}

export function Input({ error, ...props }) {
  return (
    <input
      style={{
        ...inputBase,
        borderColor: error ? 'var(--red)' : 'var(--border)',
        ...props.style,
      }}
      {...props}
    />
  )
}

export function Textarea({ error, ...props }) {
  return (
    <textarea
      style={{
        ...inputBase,
        borderColor: error ? 'var(--red)' : 'var(--border)',
        resize: 'vertical',
        minHeight: 100,
        ...props.style,
      }}
      {...props}
    />
  )
}

export function Select({ error, children, ...props }) {
  return (
    <select
      style={{
        ...inputBase,
        borderColor: error ? 'var(--red)' : 'var(--border)',
        cursor: 'pointer',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </select>
  )
}

/* ── ConfirmModal ─────────────────────────────────────── */
export function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null
  return (
    <div style={modalStyles.overlay} onClick={onCancel}>
      <div style={modalStyles.box} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 18, marginBottom: 10 }}>{title}</h3>
        <p style={{ color: 'var(--text-sec)', fontSize: 14, marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onCancel}>Hủy</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>Xác nhận xóa</Button>
        </div>
      </div>
    </div>
  )
}

const modalStyles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  },
  box: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px 32px',
    maxWidth: 420,
    width: '90%',
  },
}
