import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { productService } from '../services/productService'
import {
  PageTitle, Card, Button, Badge, Spinner, EmptyState,
  Pagination, ConfirmModal, Select,
} from '../components/ui'
import toast from 'react-hot-toast'

export default function AdminProductListPage() {
  const navigate = useNavigate()
  const { data, loading, error, params, updateParams, setPage, refetch } = useProducts()
  const { categories } = useCategories('PRODUCT')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)
  const [nameInput, setNameInput]       = useState('')

  const handleSearch = () => updateParams({ name: nameInput })
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await productService.delete(deleteTarget.id)
      toast.success(`Đã xóa "${deleteTarget.name}"`)
      setDeleteTarget(null)
      refetch(params)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xóa thất bại')
    } finally { setDeleting(false) }
  }

  const products = data?.content || []
  const total    = data?.totalElements || 0
  const totPg    = data?.totalPages || 0
  const curPage  = data?.number || 0

  return (
    <div>
      <PageTitle
        title="Sản phẩm"
        subtitle={`${total} sản phẩm`}
        action={
          <Button onClick={() => navigate('/admin/products/create')}>
            + Thêm sản phẩm
          </Button>
        }
      />

      {/* Filter bar */}
      <Card className="px-5 py-4 mb-5 flex flex-wrap gap-3 items-center">
        <input
          className="border border-border rounded-lg px-3 py-2 text-sm bg-bg text-text-pri w-56 focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Tìm theo tên..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Select
          style={{ width: 180, padding: '8px 12px', fontSize: 13 }}
          value={params.categoryId || ''}
          onChange={(e) => updateParams({ categoryId: e.target.value })}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <Select
          style={{ width: 150, padding: '8px 12px', fontSize: 13 }}
          value={params.isActive !== undefined ? String(params.isActive) : ''}
          onChange={(e) => updateParams({ isActive: e.target.value === '' ? undefined : e.target.value === 'true' })}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Hiển thị</option>
          <option value="false">Ẩn</option>
        </Select>
        <Button variant="ghost" onClick={handleSearch}>Tìm</Button>
        <Button variant="ghost" onClick={() => { setNameInput(''); updateParams({ categoryId: '', isActive: undefined }) }}>Reset</Button>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={36} /></div>
        ) : error ? (
          <p className="text-red text-sm text-center py-10">{error}</p>
        ) : products.length === 0 ? (
          <EmptyState
            title="Chưa có sản phẩm nào"
            description="Thêm sản phẩm đầu tiên"
            action={<Button onClick={() => navigate('/admin/products/create')}>+ Thêm sản phẩm</Button>}
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-card">
                <th className="text-left px-4 py-3 font-semibold text-text-sec">Mã SP</th>
                <th className="text-left px-4 py-3 font-semibold text-text-sec">Tên sản phẩm</th>
                <th className="text-left px-4 py-3 font-semibold text-text-sec">Danh mục</th>
                <th className="text-left px-4 py-3 font-semibold text-text-sec">Trạng thái</th>
                <th className="text-right px-4 py-3 font-semibold text-text-sec">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-bg-hover transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-text-sec">{p.productCode}</td>
                  <td
                    className="px-4 py-3 font-medium text-text-pri cursor-pointer hover:text-accent"
                    onClick={() => navigate(`/admin/products/${p.id}`)}
                  >
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-text-sec">{p.categoryName || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge color={p.isActive ? 'green' : 'gray'}>
                      {p.isActive ? 'Hiển thị' : 'Ẩn'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/products/${p.id}/edit`)}>Sửa</Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleteTarget(p)}>Xóa</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {totPg > 1 && (
          <div className="px-4 py-3 border-t border-border">
            <Pagination current={curPage} total={totPg} onChange={setPage} />
          </div>
        )}
      </Card>

      <ConfirmModal
        open={!!deleteTarget}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa "${deleteTarget?.name}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}