// src/utils/formatters.js
import { format, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: vi })
  } catch {
    return dateStr
  }
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy HH:mm', { locale: vi })
  } catch {
    return dateStr
  }
}

export const formatSalary = (salary) => {
  if (!salary) return 'Thỏa thuận'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary)
}

export const getStatusLabel = (status) => {
  const map = { ACTIVE: 'Đang tuyển', CLOSED: 'Đã đóng' }
  return map[status] || status
}

export const getStatusColor = (status) => {
  const map = { ACTIVE: 'var(--green)', CLOSED: 'var(--text-mute)' }
  return map[status] || 'var(--text-sec)'
}

export const getCategoryTypeLabel = (type) => {
  const map = { JOB: 'Việc làm', PRODUCT: 'Sản phẩm' }
  return map[type] || type
}
