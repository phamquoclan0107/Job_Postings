import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useJobs } from '../../hooks/useJobs'
import { useCategories } from '../../hooks/useCategories'
import { useSavedJobs } from '../../hooks/useSavedJobs'
import { formatDate } from '../../utils/formatters'

function formatSalaryRange(job) {
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

function formatMillions(value) {
  if (value == null) return '0'
  const millions = Number(value) / 1_000_000
  return millions % 1 === 0 ? `${millions}tr` : `${millions.toFixed(1)}tr`
}

export default function PublicJobListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initKeyword = searchParams.get('keyword') || ''

  const { data, loading, error, params, updateParams, setPage } = useJobs({
    keyword: initKeyword,
    status:  'ACTIVE',
    size:    9,
  })
  const { categories } = useCategories('JOB')
  const { toggle, isSaved } = useSavedJobs()

  const [keywordInput, setKeywordInput] = useState(initKeyword)
  const [locationInput, setLocationInput] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')

  const handleSearch = () => {
    updateParams({
      keyword:   keywordInput,
      location:  locationInput,
      salaryMin: salaryMin || undefined,
      salaryMax: salaryMax || undefined,
    })
  }

  const handleReset = () => {
    setKeywordInput('')
    setLocationInput('')
    setSalaryMin('')
    setSalaryMax('')
    updateParams({ keyword: '', location: '', salaryMin: '', salaryMax: '', categoryId: '', sort: 'createdAt,desc' })
  }

  const jobs      = data?.content || []
  const total     = data?.totalElements || 0
  const totalPages = data?.totalPages || 0
  const curPage   = data?.number || 0

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a2340', marginBottom: 8 }}>Tin tuyển dụng</h1>
      <p style={{ color: '#6b7280', marginBottom: 32, fontSize: 14 }}>{total} vị trí đang tuyển dụng</p>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Sidebar Filters */}
        <aside style={{ width: 240, flexShrink: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: '#1a2340', marginBottom: 16 }}>Bộ lọc</h3>

          <FilterGroup label="Từ khóa">
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Vị trí, kỹ năng..."
              style={inputStyle}
            />
          </FilterGroup>

          <FilterGroup label="Địa điểm">
            <input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="TP.HCM, Hà Nội..."
              style={inputStyle}
            />
          </FilterGroup>

          <FilterGroup label="Danh mục">
            <select
              value={params.categoryId || ''}
              onChange={(e) => updateParams({ categoryId: e.target.value || '' })}
              style={inputStyle}
            >
              <option value="">Tất cả</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FilterGroup>

          <FilterGroup label="Khoảng lương (triệu VNĐ)">
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="Từ" style={{ ...inputStyle, width: '50%' }} />
              <input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="Đến" style={{ ...inputStyle, width: '50%' }} />
            </div>
          </FilterGroup>

          <FilterGroup label="Sắp xếp">
            <select value={params.sort} onChange={(e) => updateParams({ sort: e.target.value })} style={inputStyle}>
              <option value="createdAt,desc">Mới nhất</option>
              <option value="createdAt,asc">Cũ nhất</option>
              <option value="salary,desc">Lương cao nhất</option>
              <option value="salary,asc">Lương thấp nhất</option>
              <option value="expiresAt,asc">Sắp hết hạn</option>
            </select>
          </FilterGroup>

          <button onClick={handleSearch} style={btnPrimary}>Tìm kiếm</button>
          <button onClick={handleReset} style={btnGhost}>Đặt lại</button>
        </aside>

        {/* Results */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, height: 200, border: '1px solid #e5e7eb', opacity: 0.5 }} />
              ))}
            </div>
          ) : error ? (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 24, color: '#dc2626', textAlign: 'center' }}>{error}</div>
          ) : jobs.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, padding: 60, textAlign: 'center', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p style={{ color: '#6b7280', fontSize: 14 }}>Không tìm thấy tin tuyển dụng phù hợp</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    saved={isSaved(job.id)}
                    onSave={(e) => { e.stopPropagation(); toggle(job.id) }}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                  <button disabled={curPage === 0} onClick={() => setPage(curPage - 1)} style={pageBtnStyle(false)}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i)} style={pageBtnStyle(i === curPage)}>{i + 1}</button>
                  ))}
                  <button disabled={curPage === totalPages - 1} onClick={() => setPage(curPage + 1)} style={pageBtnStyle(false)}>›</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function JobCard({ job, saved, onSave, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', position: 'relative', transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
    >

      <div style={{ padding: 16 }}>
        <button onClick={onSave} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6 }}>
          <BookmarkIcon filled={saved} />
        </button>

        <div style={{ fontWeight: 700, fontSize: 14, color: '#1a2340', marginBottom: 6, paddingRight: 28, lineHeight: 1.4 }}>{job.title}</div>
        <div style={{ fontSize: 12, color: '#1a7a4a', fontWeight: 500, marginBottom: 10 }}>{job.categoryName}</div>

        {job.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', fontSize: 12, marginBottom: 8 }}>
            📍 {job.location}
          </div>
        )}

        {job.expiresAt && (
          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 10 }}>Hết hạn: {formatDate(job.expiresAt)}</div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
          <span style={{ color: '#1a7a4a', fontWeight: 700, fontSize: 14 }}>{formatSalaryRange(job)}</span>
          {job.salaryType && <span style={{ background: '#f3f4f6', color: '#6b7280', fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 10 }}>{job.salaryType}</span>}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

function BookmarkIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#1a7a4a' : 'none'} stroke={filled ? '#1a7a4a' : '#9ca3af'} strokeWidth="2">
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
  )
}

const inputStyle = {
  width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8,
  fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#1a2340', background: '#f9fafb'
}

const btnPrimary = {
  width: '100%', padding: '10px', background: '#1a7a4a', color: '#fff', border: 'none',
  borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 8
}

const btnGhost = {
  width: '100%', padding: '10px', background: 'none', color: '#6b7280', border: '1px solid #e5e7eb',
  borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer'
}

const pageBtnStyle = (active) => ({
  width: 36, height: 36, border: `1px solid ${active ? '#1a7a4a' : '#e5e7eb'}`,
  borderRadius: 8, background: active ? '#1a7a4a' : '#fff', color: active ? '#fff' : '#4b5563',
  cursor: 'pointer', fontSize: 13, fontWeight: active ? 700 : 400,
})