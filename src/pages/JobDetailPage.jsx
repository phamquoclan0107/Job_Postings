import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobService } from '../services/jobService'
import { Button, Badge, Card, Spinner, PageTitle } from '../components/ui'
import { formatDate, formatDateTime, getStatusLabel, getStatusColor, getIncomeLevelLabel } from '../utils/formatters'

export default function JobDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [job, setJob]         = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    jobService.getById(id)
      .then((data) => { if (!cancelled) { setJob(data); setLoading(false) } })
      .catch((err) => {
        if (!cancelled) { setError(err?.response?.data?.message || err?.message || 'Không tải được chi tiết job'); setLoading(false) }
      })
    return () => { cancelled = true }
  }, [id])

  if (loading) return <div className="flex justify-center items-center py-20"><Spinner size={36} /></div>
  if (error)   return <div className="flex justify-center items-center py-20 text-red text-sm">{error}</div>
  if (!job)    return null

  return (
    <div>
      <PageTitle
        title={job.title}
        subtitle={`ID #${job.id} · ${job.categoryName || ''}`}
        action={
          <div className="flex gap-2.5">
            <Button variant="ghost" onClick={() => navigate('/admin/jobs')}>← Quay lại</Button>
            <Button onClick={() => navigate(`/admin/jobs/${id}/edit`)}>
              <EditIcon /> Chỉnh sửa
            </Button>
          </div>
        }
      />

      <div className="flex gap-5 items-start flex-wrap">
        {/* Left */}
        <div className="flex-1 min-w-0">

          <Card className="p-7 mb-5">
            <h2 className="font-head text-[15px] font-bold text-text-pri mb-3.5">Mô tả công việc</h2>
            {job.description ? (
              <div className="text-sm text-text-sec leading-[1.8] whitespace-pre-wrap">{job.description}</div>
            ) : (
              <p className="text-sm text-text-mute italic">Chưa có mô tả</p>
            )}
          </Card>

          {job.requirements && (
            <Card className="p-7 mb-5">
              <h2 className="font-head text-[15px] font-bold text-text-pri mb-3.5">Yêu cầu ứng viên</h2>
              <div className="text-sm text-text-sec leading-[1.8] whitespace-pre-wrap">{job.requirements}</div>
            </Card>
          )}

          {job.benefits && (
            <Card className="p-7 mb-5">
              <h2 className="font-head text-[15px] font-bold text-text-pri mb-3.5">Quyền lợi</h2>
              <div className="text-sm text-text-sec leading-[1.8] whitespace-pre-wrap">{job.benefits}</div>
            </Card>
          )}
        </div>

        {/* Right */}
        <div className="w-[280px] flex-shrink-0">
          <Card className="px-[22px] py-5 mb-4">
            <h3 className="font-head text-[15px] font-bold text-text-pri mb-3.5">Thông tin chung</h3>
            <InfoRow label="Trạng thái"><Badge color={getStatusColor(job.status)}>{getStatusLabel(job.status)}</Badge></InfoRow>
            <InfoRow label="Danh mục">{job.categoryName || '—'}</InfoRow>
            <InfoRow label="Mức thu nhập">{getIncomeLevelLabel(job.incomeLevel)}</InfoRow>
            <InfoRow label="Địa điểm">{job.location || '—'}</InfoRow>
            <InfoRow label="Hết hạn">{formatDate(job.expiresAt)}</InfoRow>
            {job.postedAt && <InfoRow label="Ngày đăng">{formatDateTime(job.postedAt)}</InfoRow>}
          </Card>

          <Card className="px-[22px] py-5">
            <h3 className="font-head text-[15px] font-bold text-text-pri mb-3.5">Hệ thống</h3>
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
    <div className="flex justify-between items-center py-2 border-b border-border text-[13px]">
      <span className="text-text-mute">{label}</span>
      <span className="text-text-pri font-medium text-right max-w-[160px]">{children}</span>
    </div>
  )
}

function EditIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
}