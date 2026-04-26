import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJobs } from '../hooks/useJobs'
import { useCategories } from '../hooks/useCategories'
import { jobService } from '../services/jobService'
import {
  PageTitle, Card, Button, Badge, Spinner, EmptyState,
  Pagination, ConfirmModal, Select,
} from '../components/ui'
import { formatDate, getStatusLabel, getStatusColor, getIncomeLevelLabel } from '../utils/formatters'
import toast from 'react-hot-toast'

export default function JobListPage() {
  const navigate = useNavigate()
  const { data, loading, error, params, updateParams, setPage, refetch } = useJobs()
  const { categories } = useCategories('JOB')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)
  const [titleInput, setTitleInput]     = useState('')

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
    } finally { setDeleting(false) }
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
          <Button onClick={() => navigate('/admin/jobs/create')}>
            <PlusIcon /> Tạo tin mới
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-5 px-5 py-4">
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-mute pointer-events-none" />
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tìm theo tiêu đề... (Enter)"
              className="w-full pl-9 pr-3 py-[9px] bg-bg border border-border rounded-[6px] text-text-pri text-sm outline-none"
            />
          </div>

          <Select value={params.categoryId || ''} onChange={(e) => updateParams({ categoryId: e.target.value || '' })} className="flex-none w-[180px]">
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>

          <Select value={params.status || ''} onChange={(e) => updateParams({ status: e.target.value || '' })} className="flex-none w-[150px]">
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang tuyển</option>
            <option value="CLOSED">Đã đóng</option>
          </Select>

          <Select value={params.sort || 'createdAt,desc'} onChange={(e) => updateParams({ sort: e.target.value })} className="flex-none w-[180px]">
            <option value="createdAt,desc">Mới nhất trước</option>
            <option value="createdAt,asc">Cũ nhất trước</option>
            <option value="title,asc">Tiêu đề A→Z</option>
            <option value="title,desc">Tiêu đề Z→A</option>
            <option value="expiresAt,asc">Sắp hết hạn</option>
          </Select>

          <Button variant="ghost" onClick={() => { setTitleInput(''); updateParams({ title: '', categoryId: '', status: '', sort: 'createdAt,desc' }) }}>
            Đặt lại
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-16"><Spinner size={32} /></div>
        ) : error ? (
          <div className="flex justify-center items-center py-16 text-red text-sm">{error}</div>
        ) : jobs.length === 0 ? (
          <EmptyState message="Không tìm thấy tin tuyển dụng nào" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['ID', 'Tiêu đề', 'Danh mục', 'Mức thu nhập', 'Địa điểm', 'Trạng thái', 'Hết hạn', 'Ngày tạo', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-text-mute uppercase tracking-[0.06em] border-b border-border whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="cursor-pointer hover:bg-bg-hover transition-colors duration-[120ms]"
                      onClick={() => navigate(`/admin/jobs/${job.id}`)}>
                      <td className="px-4 py-3.5 border-b border-border align-middle">
                        <span className="text-text-mute font-mono text-xs">#{job.id}</span>
                      </td>
                      <td className="px-4 py-3.5 border-b border-border align-middle max-w-[220px]">
                        <span className="font-medium text-[13px] overflow-hidden text-ellipsis whitespace-nowrap">{job.title}</span>
                      </td>
                      <td className="px-4 py-3.5 border-b border-border align-middle">
                        <span className="text-xs text-text-sec bg-bg-hover px-2 py-0.5 rounded">{job.categoryName || '—'}</span>
                      </td>
                      <td className="px-4 py-3.5 border-b border-border align-middle text-[13px] font-medium" style={{ color: '#1a7a4a' }}>
                        {getIncomeLevelLabel(job.incomeLevel)}
                      </td>
                      <td className="px-4 py-3.5 border-b border-border align-middle text-[13px] text-text-sec">{job.location || '—'}</td>
                      <td className="px-4 py-3.5 border-b border-border align-middle">
                        <Badge color={getStatusColor(job.status)}>{getStatusLabel(job.status)}</Badge>
                      </td>
                      <td className="px-4 py-3.5 border-b border-border align-middle text-[13px] text-text-sec">{formatDate(job.expiresAt)}</td>
                      <td className="px-4 py-3.5 border-b border-border align-middle text-xs text-text-mute">{formatDate(job.createdAt)}</td>
                      <td className="px-4 py-3.5 border-b border-border align-middle" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}><EditIcon /></Button>
                          <Button size="sm" variant="danger" onClick={() => setDeleteTarget(job)}><TrashIcon /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={curPage} totalPages={totPg} totalElements={total} size={params.size} onPageChange={setPage} />
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

function PlusIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function SearchIcon(p) { return <svg {...p} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function EditIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg> }
function TrashIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg> }