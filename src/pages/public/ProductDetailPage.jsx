// src/pages/public/ProductDetailPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { addToCart, isInCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()
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

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Đang tải...</div>
  if (error)   return <div style={{ textAlign: 'center', padding: 60, color: '#dc2626' }}>{error}</div>
  if (!product) return null

  const images = product.images || []
  const thumb = images[activeImg]?.url

  const handleAddToCart = () => {
    addToCart(product)
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng`)
  }

  const handleWishlist = () => {
    toggle(product.id)
    toast(isWishlisted(product.id) ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích', { icon: '❤️' })
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 28, fontSize: 13, color: '#6b7280' }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#1a7a4a' }}>Trang chủ</span>
        <span>›</span>
        <span onClick={() => navigate('/products')} style={{ cursor: 'pointer', color: '#1a7a4a' }}>Sản phẩm</span>
        <span>›</span>
        <span style={{ color: '#1a2340' }}>{product.name}</span>
      </div>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Images */}
        <div style={{ width: 360, flexShrink: 0 }}>
          <div style={{ background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden' }}>
            {thumb ? (
              <img src={thumb} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                onError={(e) => e.target.style.display = 'none'} />
            ) : (
              <PillIconLarge />
            )}
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <div
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  style={{ width: 60, height: 60, borderRadius: 8, border: `2px solid ${i === activeImg ? '#1a7a4a' : '#e5e7eb'}`, overflow: 'hidden', cursor: 'pointer', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => e.target.style.display = 'none'} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: '#1a7a4a', fontWeight: 600, marginBottom: 8 }}>{product.categoryName}</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a2340', margin: '0 0 8px', lineHeight: 1.3 }}>{product.name}</h1>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 24, letterSpacing: '0.06em' }}>Mã: {product.productCode}</div>

          {product.description && (
            <div style={{ background: '#f9fafb', borderRadius: 10, padding: 18, marginBottom: 24, fontSize: 14, lineHeight: 1.8, color: '#374151', whiteSpace: 'pre-wrap' }}>
              {product.description}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <button
              onClick={handleAddToCart}
              style={{ flex: 1, padding: '14px', background: isInCart(product.id) ? '#f0fdf4' : '#1a7a4a', color: isInCart(product.id) ? '#1a7a4a' : '#fff', border: isInCart(product.id) ? '1px solid #bbf7d0' : 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <CartIcon /> {isInCart(product.id) ? '✓ Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}
            </button>
            <button
              onClick={handleWishlist}
              style={{ padding: '14px 18px', border: '1px solid #e5e7eb', borderRadius: 10, background: 'none', cursor: 'pointer' }}
            >
              <HeartIcon filled={isWishlisted(product.id)} />
            </button>
          </div>

          <a href="mailto:talents@fremed.com.vn?subject=Đặt hàng"
            style={{ display: 'block', textAlign: 'center', color: '#1a7a4a', textDecoration: 'none', fontSize: 13, fontWeight: 600, padding: '10px', border: '1px solid #bbf7d0', borderRadius: 10, background: '#f0fdf4' }}>
            Liên hệ đặt hàng: talents@fremed.com.vn
          </a>
        </div>
      </div>
    </div>
  )
}

function CartIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
}
function HeartIcon({ filled }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? '#ef4444' : 'none'} stroke={filled ? '#ef4444' : '#9ca3af'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
}
function PillIconLarge() {
  return <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="M8.5 8.5 16 16"/></svg>
}