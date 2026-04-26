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

const formatMillions = (value) => {
  if (value == null) return '0'
  const millions = Number(value) / 1_000_000
  return millions % 1 === 0 ? `${millions}tr` : `${millions.toFixed(1)}tr`
}

// Deprecated — giữ lại để tương thích
export const formatSalaryRange = (job) => {
  const { salary, salaryMin, salaryMax } = job || {}
  if (salaryMin != null && salaryMax != null) {
    return `${formatMillions(salaryMin)} - ${formatMillions(salaryMax)}`
  }
  if (salaryMin != null) return `Từ ${formatMillions(salaryMin)}`
  if (salaryMax != null) return `Đến ${formatMillions(salaryMax)}`
  if (salary != null) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary)
  }
  return 'Thỏa thuận'
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

export const getJobTypeLabel = (type) => {
  const map = {
    FULL_TIME: 'Toàn thời gian',
    PART_TIME: 'Bán thời gian',
    CONTRACT: 'Hợp đồng',
    REMOTE: 'Làm từ xa',
    INTERNSHIP: 'Thực tập',
  }
  return map[type] || type
}

export const getExperienceLevelLabel = (level) => {
  const map = {
    FRESHER: 'Fresher',
    JUNIOR: 'Junior (1-2 năm)',
    MID: 'Mid (2-4 năm)',
    SENIOR: 'Senior (4+ năm)',
    LEAD: 'Lead / Manager',
  }
  return map[level] || level
}

export const getIncomeLevelLabel = (level) => {
  const map = {
    THOA_THUAN: 'Thỏa thuận',
    DUOI_10TR:  'Dưới 10 triệu',
    TU_10_15TR: '10 - 15 triệu',
    TU_15_20TR: '15 - 20 triệu',
    TU_20_30TR: '20 - 30 triệu',
    TREN_30TR:  'Trên 30 triệu',
  }
  return map[level] || level || 'Thỏa thuận'
}