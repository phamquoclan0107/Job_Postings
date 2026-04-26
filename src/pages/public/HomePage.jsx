// src/pages/public/HomePage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService'

export default function HomePage() {
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.search({ isActive: true, size: 8, sort: 'createdAt,desc' })
      .then((p) => setFeaturedProducts(p.content || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#111827',
          textAlign: 'center',
          marginBottom: 32,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
        }}>
          SẢN PHẨM NỔI BẬT
        </h2>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} style={{ background: '#f3f4f6', borderRadius: 8, height: 200, border: '1px solid #e5e7eb' }} />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40, fontSize: 14 }}>Chưa có sản phẩm nào</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => navigate(`/products/${product.id}`)} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function ProductCard({ product, onClick }) {
  const thumb = product.images?.[0]?.url
  return (
    <div
      onClick={onClick}
      style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ height: 140, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid #f3f4f6' }}>
        {thumb ? (
          <img src={thumb} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none' }} />
        ) : <PillIcon />}
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>{product.categoryName}</div>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
      </div>
    </div>
  )
}

function PillIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
      <path d="M8.5 8.5 16 16"/>
    </svg>
  )
}
