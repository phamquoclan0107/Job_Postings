// src/pages/public/ProductDetailPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService'

export default function ProductDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    setLoading(true)
    productService.getById(id)
      .then((data) => { setProduct(data); setActiveImg(0) })
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Không tải được sản phẩm'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#6b7280', background: '#fff' }}>Đang tải...</div>
  if (error)   return <div style={{ textAlign: 'center', padding: 60, color: '#dc2626', background: '#fff' }}>{error}</div>
  if (!product) return null

  const images = product.images || []
  const thumb  = images[activeImg]?.url

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 32, fontSize: 13, color: '#9ca3af' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#374151' }}>Trang chủ</span>
          <span>›</span>
          <span onClick={() => navigate('/products')} style={{ cursor: 'pointer', color: '#374151' }}>Sản phẩm</span>
          <span>›</span>
          <span style={{ color: '#111827', fontWeight: 500 }}>{product.name}</span>
        </div>

        {/* Main layout: image left, info right */}
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Left: image */}
          <div style={{ flexShrink: 0, width: 320 }}>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginBottom: 12,
              background: '#fafafa',
            }}>
              {thumb ? (
                <img
                  src={thumb}
                  alt={product.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : <PillIcon />}
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 6,
                      border: `2px solid ${i === activeImg ? '#111827' : '#e5e7eb'}`,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: '#fafafa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: product info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Product name */}
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '0.01em' }}>
              {product.name}
            </h1>

            {/* Category + Code */}
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
              {product.categoryName && <span style={{ marginRight: 16 }}>{product.categoryName}</span>}
              {product.productCode && <span>Mã: {product.productCode}</span>}
            </div>

            {/* Description — ingredients / chi tiết */}
            {product.description && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Chi tiết
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.9, color: '#374151', whiteSpace: 'pre-wrap' }}>
                  {product.description}
                </div>
              </div>
            )}

            {/* Contact */}
            <a
              href="mailto:talents@fremed.com.vn?subject=Đặt hàng"
              style={{
                display: 'inline-block',
                marginTop: 8,
                padding: '12px 28px',
                background: '#111827',
                color: '#fff',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Liên hệ đặt hàng
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function PillIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
      <path d="M8.5 8.5 16 16"/>
    </svg>
  )
}
