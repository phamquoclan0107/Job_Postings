// src/pages/CategoryPage.jsx
import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { categoryService } from '../services/categoryService'
import {
  PageTitle, Card, Button, Badge, Spinner, EmptyState,
  ConfirmModal, FormField, Input, Select,
} from '../components/ui'
import { formatDateTime, getCategoryTypeLabel } from '../utils/formatters'
import toast from 'react-hot-toast'

/* ── Category type color ─────────────────────────────── */
const typeColor = (type) =>
  type === 'JOB' ? 'var(--accent)' : 'var(--blue)'

export default function CategoryPage() {
  const { categories, loading, error, refetch } = useCategories()

  const [typeFilter, setTypeFilter] = useState('')

  // Modal state
  const [modal, setModal]         = useState(null)  // null | 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Form state (used by both create & edit)
  const [form, setForm]   = useState({ name: '', type: '' })
  const [saving, setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formErr, setFormErr] = useState({})

  const openCreate = () => {
    setForm({ name: '', type: '' })
    setFormErr({})
    setModal('create')
  }

  const openEdit = (cat) => {
    setEditTarget(cat)
    setForm({ name: cat.name, type: cat.type })
    setFormErr({})
    setModal('edit')
  }

  const closeModal = () => { setModal(null); setEditTarget(null) }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Tên không được để trống'
    else if (form.name.length < 2) errs.name = 'Tối thiểu 2 ký tự'
    else if (form.name.length > 100) errs.name = 'Tối đa 100 ký tự'
    if (!form.type) errs.type = 'Vui lòng chọn loại'
    return errs
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setFormErr(errs); return }

    setSaving(true)
    try {
      if (modal === 'create') {
        await categoryService.create(form)
        toast.success('Tạo danh mục thành công!')
      } else {
        await categoryService.update(editTarget.id, form)
        toast.success('Cập nhật thành công!')
      }
      closeModal()
      refetch()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Thao tác thất bại')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await categoryService.delete(deleteTarget.id)
      toast.success(`Đã xóa "${deleteTarget.name}"`)
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xóa thất bại')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = typeFilter
    ? categories.filter((c) => c.type === typeFilter)
    : categories

  return (
    <div>
      <PageTitle
        title="Danh mục"
        subtitle={`${categories.length} danh mục`}
        action={
          <Button onClick={openCreate}>
            <PlusIcon /> Tạo danh mục
          </Button>
        }
      />

      {/* Filter bar */}
      <Card style={{ marginBottom: 20, padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-sec)' }}>Lọc theo loại:</span>
          {['', 'JOB', 'PRODUCT'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: '5px 14px',
                borderRadius: 20,
                border: '1px solid',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                transition: 'var(--transition)',
                borderColor: typeFilter === t ? 'var(--accent)' : 'var(--border)',
                background:  typeFilter === t ? 'var(--accent-dim)' : 'transparent',
                color:       typeFilter === t ? 'var(--accent)' : 'var(--text-sec)',
              }}
            >
              {t === '' ? 'Tất cả' : getCategoryTypeLabel(t)}
            </button>
          ))}
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div style={center}><Spinner size={32} /></div>
        ) : error ? (
          <div style={{ ...center, color: 'var(--red)', fontSize: 14 }}>{error}</div>
        ) : filtered.length === 0 ? (
          <EmptyState message="Không có danh mục nào" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {['ID', 'Tên danh mục', 'Loại', 'Ngày tạo', ''].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat) => (
                  <tr key={cat.id} style={trStyle}>
                    <td style={tdStyle}>
                      <span style={{ color: 'var(--text-mute)', fontFamily: 'monospace', fontSize: 12 }}>#{cat.id}</span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{cat.name}</td>
                    <td style={tdStyle}>
                      <Badge color={typeColor(cat.type)}>{getCategoryTypeLabel(cat.type)}</Badge>
                    </td>
                    <td style={{ ...tdStyle, fontSize: 12, color: 'var(--text-mute)' }}>
                      {formatDateTime(cat.createdAt)}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button size="sm" variant="ghost" onClick={() => openEdit(cat)}>
                          <EditIcon />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleteTarget(cat)}>
                          <TrashIcon />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create / Edit Modal */}
      {modal && (
        <div style={overlayStyle} onClick={closeModal}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitle}>
              {modal === 'create' ? 'Tạo danh mục mới' : 'Chỉnh sửa danh mục'}
            </h3>

            <FormField label="Tên danh mục" required error={formErr.name}>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ví dụ: Kỹ thuật phần mềm"
                error={formErr.name}
                autoFocus
              />
            </FormField>

            <FormField label="Loại danh mục" required error={formErr.type}>
              <Select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                error={formErr.type}
              >
                <option value="">-- Chọn loại --</option>
                <option value="JOB">JOB — Việc làm</option>
                <option value="PRODUCT">PRODUCT — Sản phẩm</option>
              </Select>
            </FormField>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <Button variant="ghost" onClick={closeModal}>Hủy</Button>
              <Button onClick={handleSave} loading={saving}>
                {modal === 'create' ? 'Tạo' : 'Lưu'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Xóa danh mục"
        message={`Bạn có chắc muốn xóa danh mục "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}

const center     = { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }
const tableStyle = { width: '100%', borderCollapse: 'collapse' }
const thStyle    = { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }
const tdStyle    = { padding: '14px 16px', fontSize: 14, color: 'var(--text-pri)', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' }
const trStyle    = { transition: 'background 0.12s' }

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modalBox     = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 32px', maxWidth: 440, width: '90%' }
const modalTitle   = { fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, marginBottom: 20 }

function PlusIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function EditIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg> }
function TrashIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg> }
