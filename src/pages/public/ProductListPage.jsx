import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService'
import { useCategories } from '../../hooks/useCategories'

export default function ProductListPage() {
  const navigate = useNavigate()
  const { categories } = useCategories('PRODUCT')
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [categoryId, setCategoryId] = useState('')
  const [keyword, setKeyword]     = useState('')
  const [keyInput, setKeyInput]   = useState('')
  const [page, setPage]           = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal]         = useState(0)

  const fetchProducts = (params = {}) => {
    setLoading(true)
    setError(null)
    productService.search({
      isActive: true,
      size: 12,
      sort: 'createdAt,desc',
      ...params,
    })
      .then((data) => {
        setProducts(data.content || [])
        setTotalPages(data.totalPages || 0)
        setTotal(data.totalElements || 0)
      })
      .catch((err) => setError(err?.message || 'Lỗi hệ thống. Vui lòng thử lại sau.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts({ page, categoryId: categoryId || undefined, keyword: keyword || undefined })
  }, [page, categoryId, keyword])

  const handleSearch = () => {
    setPage(0)
    setKeyword(keyInput)
  }

  const handleReset = () => {
    setKeyInput('')
    setKeyword('')
    setCategoryId('')
    setPage(0)
  }

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Sản phẩm</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>{total} sản phẩm</p>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Sidebar filter */}
          <aside style={{ width: 220, flexShrink: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 14 }}>Bộ lọc</h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Từ khóa</label>
              <input
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Tên sản phẩm..."
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Danh mục</label>
              <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(0) }} style={inputStyle}>
                <option value="">Tất cả</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <button onClick={handleSearch} style={btnPrimary}>Tìm kiếm</button>
            <button onClick={handleReset} style={btnGhost}>Đặt lại</button>
          </aside>

          {/* Product grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16 }}>
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 10, height: 240, border: '1px solid #e5e7eb', opacity: 0.5 }} />
                ))}
              </div>
            ) : error ? (
              <div style={{ background: '#fff', borderRadius: 12, padding: 48, textAlign: 'center' }}>
                <p style={{ color: '#dc2626', marginBottom: 16 }}>{error}</p>
                <button onClick={() => fetchProducts({ page, categoryId: categoryId || undefined })} style={{ color: '#1a7a4a', background: 'none', border: '1px solid #1a7a4a', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontSize: 13 }}>
                  ← Quay lại
                </button>
              </div>
            ) : products.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 12, padding: 60, textAlign: 'center', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
                <p style={{ color: '#6b7280', fontSize: 14 }}>Không tìm thấy sản phẩm phù hợp</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16 }}>
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} onClick={() => navigate(`/products/${p.id}`)} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                    <button disabled={page === 0} onClick={() => setPage(page - 1)} style={pageBtnStyle(false)}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i} onClick={() => setPage(i)} style={pageBtnStyle(i === page)}>{i + 1}</button>
                    ))}
                    <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)} style={pageBtnStyle(false)}>›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, onClick }) {
  const thumb = product.images?.[0]?.url || product.images?.[0]?.imageUrl
  return (
    <div
      onClick={onClick}
      style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ height: 160, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid #f3f4f6' }}>
        {thumb ? (
          <img src={thumb} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none' }} />
        ) : (
          <PillIcon />
        )}
      </div>
      <div style={{ padding: '10px 12px 14px' }}>
        {product.categoryName && (
          <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>{product.categoryName}</div>
        )}
        <div style={{ fontWeight: 600, fontSize: 13, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.name}
        </div>
      </div>
    </div>
  )
}

function PillIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
      <path d="M8.5 8.5 16 16"/>
    </svg>
  )
}

const inputStyle = {
  width: '100%', padding: '7px 10px', border: '1px solid #e5e7eb', borderRadius: 7,
  fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#111827', background: '#f9fafb'
}
const btnPrimary = {
  width: '100%', padding: '9px', background: '#1a7a4a', color: '#fff', border: 'none',
  borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 8
}
const btnGhost = {
  width: '100%', padding: '9px', background: 'none', color: '#6b7280', border: '1px solid #e5e7eb',
  borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer'
}
const pageBtnStyle = (active) => ({
  width: 36, height: 36, border: `1px solid ${active ? '#1a7a4a' : '#e5e7eb'}`,
  borderRadius: 8, background: active ? '#1a7a4a' : '#fff', color: active ? '#fff' : '#4b5563',
  cursor: 'pointer', fontSize: 13, fontWeight: active ? 700 : 400,
})