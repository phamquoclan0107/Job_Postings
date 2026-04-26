// src/pages/public/CartPage.jsx
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQty, clearCart, totalItems } = useCart()

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontSize: 22, color: '#1a2340', marginBottom: 8 }}>Giỏ hàng trống</h2>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>Hãy thêm sản phẩm vào giỏ hàng</p>
        <button onClick={() => navigate('/products')} style={{ background: '#1a7a4a', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Xem sản phẩm
        </button>
      </div>
    )
  }

  const totalMail = `Đặt hàng: ${cart.map((i) => `${i.name} (SL: ${i.qty})`).join(', ')}`
  const mailto = `mailto:talents@fremed.com.vn?subject=Đặt hàng sản phẩm FreMed&body=${encodeURIComponent(totalMail)}`

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a2340', margin: 0 }}>Giỏ hàng ({totalItems})</h1>
        <button onClick={clearCart} style={{ background: 'none', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13 }}>
          Xóa tất cả
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
        {cart.map((item, idx) => {
          const thumb = item.images?.[0]?.url
          return (
            <div key={item.id} style={{ display: 'flex', gap: 16, padding: 20, borderBottom: idx < cart.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, background: '#f9fafb', borderRadius: 8, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {thumb ? <img src={thumb} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: 24 }}>💊</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#1a2340', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{item.productCode}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => updateQty(item.id, item.qty - 1)} style={qtyBtn}>−</button>
                <span style={{ width: 32, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} style={qtyBtn}>+</button>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 8 }}>✕</button>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button onClick={() => navigate('/products')} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 24px', background: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280' }}>
          Tiếp tục mua
        </button>
        <a href={mailto} style={{ background: '#1a7a4a', color: '#fff', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          📧 Gửi đơn hàng qua Email
        </a>
      </div>
    </div>
  )
}

const qtyBtn = {
  width: 28, height: 28, border: '1px solid #e5e7eb', borderRadius: 6, background: '#f9fafb',
  cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
}