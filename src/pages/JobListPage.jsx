// src/pages/JobListPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJobs } from '../hooks/useJobs'
import { useCategories } from '../hooks/useCategories'
import { jobService } from '../services/jobService'
import {
  PageTitle, Card, Button, Badge, Spinner, EmptyState,
  Pagination, ConfirmModal, Select,
} from '../components/ui'
import { formatDate, formatSalary, getStatusLabel, getStatusColor } from '../utils/formatters'
import toast from 'react-hot-toast'

export default function JobListPage() {
  const navigate = useNavigate()
  const { data, loading, error, params, updateParams, setPage, refetch } = useJobs()
  const { categories } = useCategories('JOB')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)

  // local search state (commit on Enter or blur)
  const [titleInput, setTitleInput] = useState('')

  const handleSearch = () => updateParams({ title: titleInput })
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await jobService.delete(deleteTarget.id)
      toast.success(`Đã xóa "${deleteTarget.title}"`)
      setDeleteTarget(null)
      refetch(params)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xóa thất bại')
    } finally {
      setDeleting(false)
    }
  }

  const jobs    = data?.content || []
  const total   = data?.totalElements || 0
  const totPg   = data?.totalPages || 0
  const curPage = data?.number || 0

  return (
    <div>
      <PageTitle
        title="Tin tuyển dụng"
        subtitle={`${total} vị trí`}
        action={
          <Button onClick={() => navigate('/jobs/create')}>
            <PlusIcon /> Tạo tin mới
          </Button>
        }
      />

      {/* ── Filters ─────────────────────────────── */}
      <Card style={{ marginBottom: 20, padding: '16px 20px' }}>
        <div style={filterRow}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <SearchIcon style={searchIconStyle} />
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tìm theo tiêu đề... (Enter)"
              style={searchInput}
            />
          </div>

          {/* Category filter */}
          <Select
            value={params.categoryId || ''}
            onChange={(e) => updateParams({ categoryId: e.target.value || '' })}
            style={{ flex: '0 0 180px' }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>

          {/* Status filter */}
          <Select
            value={params.status || ''}
            onChange={(e) => updateParams({ status: e.target.value || '' })}
            style={{ flex: '0 0 150px' }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang tuyển</option>
            <option value="CLOSED">Đã đóng</option>
          </Select>

          {/* Sort */}
          <Select
            value={params.sort || 'createdAt,desc'}
            onChange={(e) => updateParams({ sort: e.target.value })}
            style={{ flex: '0 0 180px' }}
          >
            <option value="createdAt,desc">Mới nhất trước</option>
            <option value="createdAt,asc">Cũ nhất trước</option>
            <option value="title,asc">Tiêu đề A→Z</option>
            <option value="title,desc">Tiêu đề Z→A</option>
            <option value="salary,desc">Lương cao nhất</option>
            <option value="expiresAt,asc">Sắp hết hạn</option>
          </Select>

          <Button variant="ghost" onClick={() => { setTitleInput(''); updateParams({ title: '', categoryId: '', status: '', sort: 'createdAt,desc' }) }}>
            Đặt lại
          </Button>
        </div>
      </Card>

      {/* ── Table ───────────────────────────────── */}
      <Card>
        {loading ? (
          <div style={centerStyle}><Spinner size={32} /></div>
        ) : error ? (
          <div style={{ ...centerStyle, color: 'var(--red)', fontSize: 14 }}>{error}</div>
        ) : jobs.length === 0 ? (
          <EmptyState message="Không tìm thấy tin tuyển dụng nào" />
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    {['ID', 'Tiêu đề', 'Danh mục', 'Lương', 'Địa điểm', 'Trạng thái', 'Hết hạn', 'Ngày tạo', ''].map((h) => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} style={trStyle} onClick={() => navigate(`/jobs/${job.id}`)}>
                      <td style={tdStyle}>
                        <span style={{ color: 'var(--text-mute)', fontFamily: 'monospace', fontSize: 12 }}>#{job.id}</span>
                      </td>
                      <td style={{ ...tdStyle, maxWidth: 220 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {job.imageUrl ? (
                            <img src={job.imageUrl} alt="" style={thumbStyle} onError={(e) => { e.target.style.display = 'none' }} />
                          ) : (
                            <div style={thumbPlaceholder}><BriefcaseSmall /></div>
                          )}
                          <span style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {job.title}
                          </span>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: 12, color: 'var(--text-sec)', background: 'var(--bg-hover)', padding: '3px 8px', borderRadius: 4 }}>
                          {job.categoryName || '—'}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, fontSize: 13 }}>{formatSalary(job.salary)}</td>
                      <td style={{ ...tdStyle, fontSize: 13, color: 'var(--text-sec)' }}>{job.location || '—'}</td>
                      <td style={tdStyle}>
                        <Badge color={getStatusColor(job.status)}>
                          {getStatusLabel(job.status)}
                        </Badge>
                      </td>
                      <td style={{ ...tdStyle, fontSize: 13, color: 'var(--text-sec)' }}>{formatDate(job.expiresAt)}</td>
                      <td style={{ ...tdStyle, fontSize: 12, color: 'var(--text-mute)' }}>{formatDate(job.createdAt)}</td>
                      <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/jobs/${job.id}/edit`)}>
                            <EditIcon />
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => setDeleteTarget(job)}>
                            <TrashIcon />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={curPage}
              totalPages={totPg}
              totalElements={total}
              size={params.size}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      <ConfirmModal
        open={!!deleteTarget}
        title="Xóa tin tuyển dụng"
        message={`Bạn có chắc muốn xóa "${deleteTarget?.title}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}

/* ── Styles ──────────────────────────────────────────────── */
const filterRow  = { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }
const searchInput = {
  width: '100%', padding: '9px 12px 9px 36px',
  background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 6, color: 'var(--text-pri)', fontSize: 14,
  outline: 'none',
}
const searchIconStyle = {
  position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
  color: 'var(--text-mute)', pointerEvents: 'none',
}
const centerStyle   = { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }
const tableStyle    = { width: '100%', borderCollapse: 'collapse' }
const thStyle       = { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }
const tdStyle       = { padding: '14px 16px', fontSize: 14, color: 'var(--text-pri)', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' }
const trStyle       = { cursor: 'pointer', transition: 'background 0.12s' }
const thumbStyle    = { width: 32, height: 32, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }
const thumbPlaceholder = { width: 32, height: 32, borderRadius: 6, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--text-mute)' }

/* ── Icons ─────────────────────────────────────────────── */
function PlusIcon()       { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function SearchIcon(p)    { return <svg {...p} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function EditIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg> }
function TrashIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg> }
function BriefcaseSmall() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> }
