// src/pages/public/HomePage.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import { productService } from '../../services/productService'
import { formatSalary } from '../../utils/formatters'

export default function HomePage() {
  const navigate = useNavigate()
  const [featuredJobs, setFeaturedJobs]         = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loadingJobs, setLoadingJobs]           = useState(true)
  const [loadingProducts, setLoadingProducts]   = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    jobService.search({ status: 'ACTIVE', size: 4, sort: 'createdAt,desc' })
      .then((p) => setFeaturedJobs(p.content || []))
      .catch(() => {})
      .finally(() => setLoadingJobs(false))

    productService.search({ isActive: true, size: 8, sort: 'createdAt,desc' })
      .then((p) => setFeaturedProducts(p.content || []))
      .catch(() => {})
      .finally(() => setLoadingProducts(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/jobs?keyword=${encodeURIComponent(search)}`)
  }

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1a2340 0%, #1a7a4a 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontSize: 42, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            Cơ hội nghề nghiệp<br />
            <span style={{ color: '#4ade80' }}>trong ngành Dược phẩm</span>
          </h1>
          <p style={{ color: '#d1fae5', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Khám phá hàng trăm vị trí tuyển dụng từ FreMed — công ty dược phẩm hàng đầu tại TP.HCM
          </p>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, maxWidth: 560, margin: '0 auto' }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm vị trí công việc..."
              style={{ flex: 1, padding: '14px 20px', borderRadius: 10, border: 'none', fontSize: 14, outline: 'none' }}
            />
            <button type="submit" style={{ background: '#1a7a4a', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Tìm ngay
            </button>
          </form>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px', display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap' }}>
          {[
            { label: 'Vị trí đang tuyển', value: '20+' },
            { label: 'Tỉnh thành', value: '12' },
            { label: 'Năm kinh nghiệm', value: '10+' },
            { label: 'Nhân viên', value: '500+' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1a7a4a' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section style={{ maxWidth: 1200, margin: '60px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1a2340', margin: 0 }}>Tin tuyển dụng nổi bật</h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6 }}>Cơ hội việc làm hấp dẫn đang chờ bạn</p>
          </div>
          <Link to="/jobs" style={{ color: '#1a7a4a', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Xem tất cả →</Link>
        </div>

        {loadingJobs ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {[1,2,3,4].map((i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, height: 160, border: '1px solid #e5e7eb', opacity: 0.5, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : featuredJobs.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Chưa có tin tuyển dụng</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 20 }}>
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Products - SẢN PHẨM NỔI BẬT */}
      <section style={{ background: '#f9fafb', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1a2340', margin: 0 }}>SẢN PHẨM NỔI BẬT</h2>
              <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6 }}>Các sản phẩm dược phẩm chất lượng cao</p>
            </div>
            <Link to="/products" style={{ color: '#1a7a4a', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Xem tất cả →</Link>
          </div>

          {loadingProducts ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
              {[1,2,3,4,5,6,7,8].map((i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, height: 240, border: '1px solid #e5e7eb', opacity: 0.5 }} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Chưa có sản phẩm</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 20 }}>
              {featuredProducts.map((product) => (
                <ProductCardSimple key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1a7a4a', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Muốn ứng tuyển?</h2>
        <p style={{ color: '#d1fae5', marginBottom: 28, fontSize: 15 }}>Gửi hồ sơ của bạn ngay hôm nay qua email</p>
        <a href="mailto:talents@fremed.com.vn"
          style={{ background: '#fff', color: '#1a7a4a', padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
          Gửi hồ sơ đến talents@fremed.com.vn
        </a>
      </section>
    </div>
  )
}

function JobCard({ job }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/jobs/${job.id}`)}
      style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BriefcaseIcon />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#1a2340', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{job.categoryName}</div>
        </div>
      </div>
      {job.location && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', fontSize: 12, marginBottom: 8 }}>
          <PinIcon /> {job.location}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <span style={{ color: '#1a7a4a', fontWeight: 600, fontSize: 13 }}>{formatSalary(job.salary)}</span>
        <span style={{ background: '#f0fdf4', color: '#1a7a4a', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, border: '1px solid #bbf7d0' }}>Đang tuyển</span>
      </div>
    </div>
  )
}

function ProductCardSimple({ product }) {
  const navigate = useNavigate()
  const thumb = product.images?.[0]?.url
  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ height: 140, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {thumb ? (
          <img src={thumb} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none' }} />
        ) : (
          <PillIcon />
        )}
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#1a2340', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
        <div style={{ fontSize: 11, color: '#1a7a4a', marginTop: 4, fontWeight: 500 }}>{product.categoryName}</div>
      </div>
    </div>
  )
}

function BriefcaseIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a7a4a" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
}
function PinIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
}
function PillIcon() {
  return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="M8.5 8.5 16 16"/></svg>
}