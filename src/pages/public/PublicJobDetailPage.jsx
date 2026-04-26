import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import { useSavedJobs } from '../../hooks/useSavedJobs'
import { formatDate, formatDateTime, formatSalaryRange, getJobTypeLabel, getExperienceLevelLabel } from '../../utils/formatters'

export default function PublicJobDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { toggle, isSaved } = useSavedJobs()
  const [job, setJob]           = useState(null)
  const [similar, setSimilar]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    jobService.getById(id)
      .then((data) => {
        setJob(data)
        return jobService.getSimilar(id, 4)
      })
      .then((s) => setSimilar(Array.isArray(s) ? s : []))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Không tải được tin tuyển dụng'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} onBack={() => navigate('/jobs')} />
  if (!job)    return null

  // Dùng job.contactEmail từ backend — không hardcode
  const applyEmail  = job.contactEmail || ''
  const subject     = encodeURIComponent(`Ứng tuyển: ${job.title}`)
  const mailtoHref  = applyEmail ? `mailto:${applyEmail}?subject=${subject}` : '#'
  const salaryDisplay = formatSalaryRange(job)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24, fontSize: 13, color: '#6b7280' }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#1a7a4a' }}>Trang chủ</span>
        <span>›</span>
        <span onClick={() => navigate('/jobs')} style={{ cursor: 'pointer', color: '#1a7a4a' }}>Tuyển dụng</span>
        <span>›</span>
        <span style={{ color: '#1a2340', fontWeight: 500 }}>{job.title}</span>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header Card */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a2340', margin: '0 0 4px' }}>{job.title}</h1>
                {job.companyName && (
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{job.companyName}</div>
                )}
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#6b7280' }}>
                  <span>🏷 {job.categoryName}</span>
                  {job.location && <span>📍 {job.location}</span>}
                  {job.expiresAt && <span>⏰ Hết hạn: {formatDate(job.expiresAt)}</span>}
                  {job.postedAt && <span>📅 Đăng: {formatDateTime(job.postedAt)}</span>}
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ background: '#f0fdf4', color: '#1a7a4a', fontSize: 13, fontWeight: 700, padding: '4px 14px', borderRadius: 20, border: '1px solid #bbf7d0' }}>
                    💰 {salaryDisplay}
                  </span>
                  {job.salaryType && (
                    <span style={{ background: '#f3f4f6', color: '#374151', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20 }}>
                      {job.salaryType}
                    </span>
                  )}
                  {job.jobType && (
                    <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20 }}>
                      {getJobTypeLabel(job.jobType)}
                    </span>
                  )}
                  {job.experienceLevel && (
                    <span style={{ background: '#faf5ff', color: '#7e22ce', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20 }}>
                      {getExperienceLevelLabel(job.experienceLevel)}
                    </span>
                  )}
                  <span style={{ background: job.status === 'ACTIVE' ? '#f0fdf4' : '#f3f4f6', color: job.status === 'ACTIVE' ? '#1a7a4a' : '#6b7280', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>
                    {job.status === 'ACTIVE' ? 'Đang tuyển' : 'Đã đóng'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 28, marginBottom: 20 }}>
            <SectionTitle>MÔ TẢ CÔNG VIỆC</SectionTitle>
            {job.description
              ? <div style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', whiteSpace: 'pre-wrap' }}>{job.description}</div>
              : <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: 14 }}>Chưa có mô tả chi tiết.</p>
            }
          </div>

          {/* Requirements */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 28, marginBottom: 20 }}>
            <SectionTitle>YÊU CẦU ỨNG VIÊN</SectionTitle>
            {job.requirements
              ? <div style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', whiteSpace: 'pre-wrap' }}>{job.requirements}</div>
              : <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: 14 }}>Vui lòng liên hệ để biết thêm chi tiết.</p>
            }
          </div>

          {/* Benefits */}
          {job.benefits && (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 28, marginBottom: 20 }}>
              <SectionTitle>QUYỀN LỢI</SectionTitle>
              <div style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', whiteSpace: 'pre-wrap' }}>{job.benefits}</div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: 300, flexShrink: 0 }}>
          <div style={{ background: '#fff', border: '2px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 20, position: 'sticky', top: 84 }}>
            <h3 style={{ fontWeight: 700, color: '#1a2340', fontSize: 16, textAlign: 'center', marginBottom: 16 }}>
              BẠN HỨNG THÚ VỚI VỊ TRÍ NÀY?
            </h3>

            {applyEmail ? (
              <a href={mailtoHref}
                style={{ display: 'block', width: '100%', background: '#1a7a4a', color: '#fff', padding: '14px 16px', borderRadius: 10, textAlign: 'center', fontWeight: 700, fontSize: 14, textDecoration: 'none', boxSizing: 'border-box', marginBottom: 12 }}>
                Gửi hồ sơ đến<br />
                <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.9 }}>{applyEmail}</span>
              </a>
            ) : (
              <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, marginBottom: 12 }}>
                Chưa có email liên hệ
              </p>
            )}

            <button
              onClick={() => toggle(Number(id))}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: 10, background: 'none', cursor: 'pointer', fontSize: 13, color: '#374151', fontWeight: 500 }}>
              <BookmarkIcon filled={isSaved(Number(id))} />
              {isSaved(Number(id)) ? 'Đã lưu' : 'Lưu tin'}
            </button>

            <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '16px 0' }} />

            <InfoRow label="Khoảng lương">
              <strong style={{ color: '#1a7a4a' }}>{salaryDisplay}</strong>
            </InfoRow>
            {job.salaryType     && <InfoRow label="Loại lương">{job.salaryType}</InfoRow>}
            {job.jobType        && <InfoRow label="Hình thức">{getJobTypeLabel(job.jobType)}</InfoRow>}
            {job.experienceLevel && <InfoRow label="Kinh nghiệm">{getExperienceLevelLabel(job.experienceLevel)}</InfoRow>}
            {job.location       && <InfoRow label="Địa điểm">{job.location}</InfoRow>}
            {job.expiresAt      && <InfoRow label="Hạn nộp">{formatDate(job.expiresAt)}</InfoRow>}
            {job.postedAt       && <InfoRow label="Ngày đăng">{formatDate(job.postedAt)}</InfoRow>}
            <InfoRow label="Trạng thái">
              <span style={{ color: job.status === 'ACTIVE' ? '#1a7a4a' : '#6b7280' }}>
                {job.status === 'ACTIVE' ? 'Đang tuyển' : 'Đã đóng'}
              </span>
            </InfoRow>
          </div>
        </div>
      </div>

      {/* Similar Jobs */}
      {similar.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a2340', marginBottom: 20 }}>Tin tuyển dụng tương tự</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {similar.map((j) => (
              <div
                key={j.id}
                onClick={() => navigate(`/jobs/${j.id}`)}
                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a2340', marginBottom: 4 }}>{j.title}</div>
                {j.companyName && <div style={{ fontSize: 12, color: '#374151', marginBottom: 4 }}>{j.companyName}</div>}
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{j.location || '—'}</div>
                <div style={{ color: '#1a7a4a', fontWeight: 700, fontSize: 13 }}>{formatSalaryRange(j)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>
      <span style={{ color: '#6b7280' }}>{label}</span>
      <span style={{ color: '#1a2340', fontWeight: 500, textAlign: 'right', maxWidth: 160 }}>{children}</span>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontWeight: 700, fontSize: 15, color: '#1a2340', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #f0fdf4', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {children}
    </h2>
  )
}


function BookmarkIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#1a7a4a' : 'none'} stroke={filled ? '#1a7a4a' : '#6b7280'} strokeWidth="2">
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
  )
}

function LoadingState() {
  return (
    <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 24px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ fontSize: 14, color: '#6b7280' }}>Đang tải...</div>
    </div>
  )
}

function ErrorState({ message, onBack }) {
  return (
    <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
      <p style={{ color: '#dc2626', marginBottom: 16 }}>{message}</p>
      <button onClick={onBack} style={{ color: '#1a7a4a', background: 'none', border: '1px solid #1a7a4a', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontSize: 14 }}>
        ← Quay lại
      </button>
    </div>
  )
}