import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { Button, Badge, Card, Spinner, PageTitle } from '../components/ui'
import toast from 'react-hot-toast'

export default function AdminProductDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    productService.getById(id)
      .then((data) => { if (!cancelled) { setProduct(data); setLoading(false) } })
      .catch((err) => {
        if (!cancelled) { setError(err?.response?.data?.message || err?.message || 'Không tải được chi tiết sản phẩm'); setLoading(false) }
      })
    return () => { cancelled = true }
  }, [id])

  if (loading) return <div className="flex justify-center items-center py-20"><Spinner size={36} /></div>
  if (error)   return <div className="flex justify-center items-center py-20 text-red text-sm">{error}</div>
  if (!product) return null

  return (
    <div>
      <PageTitle
        title={product.name}
        subtitle={`ID #${product.id} · ${product.productCode}`}
        action={
          <div className="flex gap-2.5">
            <Button variant="ghost" onClick={() => navigate('/admin/products')}>← Quay lại</Button>
            <Button onClick={() => navigate(`/admin/products/${id}/edit`)}>
              Chỉnh sửa
            </Button>
          </div>
        }
      />

      <div className="flex gap-5 items-start flex-wrap">
        {/* Left — description */}
        <div className="flex-1 min-w-0">
          <Card className="p-7 mb-5">
            <h2 className="font-head text-[15px] font-bold text-text-pri mb-3.5">Mô tả sản phẩm</h2>
            {product.description ? (
              <div className="text-sm text-text-sec leading-[1.8] whitespace-pre-wrap">{product.description}</div>
            ) : (
              <p className="text-sm text-text-mute italic">Chưa có mô tả</p>
            )}
          </Card>

          {/* Images */}
          {product.images && product.images.length > 0 && (
            <Card className="p-7 mb-5">
              <h2 className="font-head text-[15px] font-bold text-text-pri mb-3.5">Hình ảnh</h2>
              <div className="grid grid-cols-3 gap-3">
                {product.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={product.name}
                    className="w-full rounded-lg object-cover"
                    style={{ maxHeight: 160 }}
                    onError={(e) => { e.target.parentElement.style.display = 'none' }}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right — meta */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <Card className="p-5 mb-5">
            <div className="flex flex-col gap-3.5 text-sm">
              <Row label="Mã sản phẩm">
                <span className="font-mono font-semibold">{product.productCode}</span>
              </Row>
              <Row label="Danh mục">{product.categoryName || '—'}</Row>
              <Row label="Trạng thái">
                <Badge color={product.isActive ? 'green' : 'gray'}>
                  {product.isActive ? 'Hiển thị' : 'Ẩn'}
                </Badge>
              </Row>
              <Row label="Số ảnh">{product.images?.length || 0}</Row>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-text-mute">{label}</span>
      <span className="text-text-pri font-medium">{children}</span>
    </div>
  )
}