// src/pages/JobDetailPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobService } from '../services/jobService'
import { Button, Badge, Card, Spinner, PageTitle } from '../components/ui'
import { formatDate, formatDateTime, formatSalary, getStatusLabel, getStatusColor } from '../utils/formatters'
import toast from 'react-hot-toast'

export default function JobDetailPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [job, setJob]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    jobService.getById(id)
      .then((data) => { if (!cancelled) { setJob(data); setLoading(false) } })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Không tải được chi tiết job')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [id])

  if (loading) return <div style={center}><Spinner size={36} /></div>
  if (error)   return <div style={{ ...center, color: 'var(--red)', fontSize: 14 }}>{error}</div>
  if (!job)    return null

  return (
    <div>
      <PageTitle
        title={job.title}
        subtitle={`ID #${job.id} · ${job.categoryName}`}
        action={
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" onClick={() => navigate('/jobs')}>← Quay lại</Button>
            <Button onClick={() => navigate(`/jobs/${id}/edit`)}>
              <EditIcon /> Chỉnh sửa
            </Button>
          </div>
        }
      />

      <div style={layout}>
        {/* Left column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Image */}
          {job.imageUrl && (
            <Card style={{ marginBottom: 20, overflow: 'hidden' }}>
              <img
                src={job.imageUrl}
                alt={job.title}
                style={{ width: '100%', maxHeight: 300, objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.target.parentElement.style.display = 'none' }}
              />
            </Card>
          )}

          {/* Description */}
          <Card style={{ padding: '24px 28px', marginBottom: 20 }}>
            <h2 style={sectionHead}>Mô tả công việc</h2>
            {job.description ? (
              <div
                style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}
              >
                {job.description}
              </div>
            ) : (
              <p style={{ fontSize: 14, color: 'var(--text-mute)', fontStyle: 'italic' }}>Chưa có mô tả</p>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <Card style={{ padding: '20px 22px', marginBottom: 16 }}>
            <h3 style={sectionHead}>Thông tin chung</h3>
            <InfoRow label="Trạng thái">
              <Badge color={getStatusColor(job.status)}>{getStatusLabel(job.status)}</Badge>
            </InfoRow>
            <InfoRow label="Danh mục">{job.categoryName || '—'}</InfoRow>
            <InfoRow label="Mức lương">{formatSalary(job.salary)}</InfoRow>
            <InfoRow label="Địa điểm">{job.location || '—'}</InfoRow>
            <InfoRow label="Hết hạn">{formatDate(job.expiresAt)}</InfoRow>
          </Card>

          <Card style={{ padding: '20px 22px' }}>
            <h3 style={sectionHead}>Hệ thống</h3>
            <InfoRow label="ID">#{job.id}</InfoRow>
            <InfoRow label="Admin ID">#{job.adminId}</InfoRow>
            <InfoRow label="Ngày tạo">{formatDateTime(job.createdAt)}</InfoRow>
            <InfoRow label="Cập nhật">{formatDateTime(job.updatedAt)}</InfoRow>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
      <span style={{ color: 'var(--text-mute)' }}>{label}</span>
      <span style={{ color: 'var(--text-pri)', fontWeight: 500, textAlign: 'right', maxWidth: 160 }}>{children}</span>
    </div>
  )
}

const center      = { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 20px' }
const layout      = { display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }
const sectionHead = { fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, color: 'var(--text-pri)', marginBottom: 14 }

function EditIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
}
