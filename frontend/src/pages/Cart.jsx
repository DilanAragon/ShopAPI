import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/order.service'

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fmt = (price) =>
    Number(price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

  const handleCheckout = async () => {
    if (!user) return navigate('/login')
    setError('')
    setLoading(true)
    try {
      await orderService.create(items.map((i) => ({ productId: i.productId, quantity: i.quantity })))
      clearCart()
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la orden')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div style={s.emptyPage}>
        <div style={s.emptyIcon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <p style={s.emptyTitle}>Tu carrito está vacío</p>
        <p style={s.emptySub}>Agrega productos para continuar</p>
        <Link to="/products" style={s.emptyBtn}>Ver productos</Link>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div className="fade-up" style={s.header}>
        <h1 style={s.title}>Carrito</h1>
        <span style={s.itemCount}>{items.length} {items.length === 1 ? 'producto' : 'productos'}</span>
      </div>

      {error && <div style={s.errorBox}>{error}</div>}

      <div style={s.layout}>
        {/* Items */}
        <div style={s.itemsList}>
          {items.map((item, i) => (
            <div key={item.productId} className={`fade-up delay-${Math.min(i + 1, 5)}`} style={s.item}>
              <div style={s.itemImg}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div style={s.itemBody}>
                <p style={s.itemName}>{item.name}</p>
                <p style={s.itemUnit}>{fmt(item.price)} / unidad</p>
              </div>
              <div style={s.qtyControl}>
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} style={s.qtyBtn}>−</button>
                <span style={s.qty}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} style={s.qtyBtn}>+</button>
              </div>
              <span style={s.itemTotal}>{fmt(Number(item.price) * item.quantity)}</span>
              <button onClick={() => removeItem(item.productId)} style={s.removeBtn} title="Eliminar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="fade-up delay-2" style={s.summary}>
          <h2 style={s.summaryTitle}>Resumen de orden</h2>

          <div style={s.summaryRows}>
            {items.map((item) => (
              <div key={item.productId} style={s.summaryRow}>
                <span style={s.summaryLabel}>{item.name} ×{item.quantity}</span>
                <span style={s.summaryVal}>{fmt(Number(item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={s.divider} />

          <div style={s.totalRow}>
            <span style={s.totalLabel}>Total</span>
            <span style={s.totalVal}>{fmt(total)}</span>
          </div>

          <button onClick={handleCheckout} disabled={loading} style={s.checkoutBtn}>
            {loading ? 'Procesando...' : !user ? 'Inicia sesión para comprar' : 'Confirmar orden'}
          </button>

          {!user && (
            <p style={s.loginNote}>
              <Link to="/login" style={{ color: '#2f80ff' }}>Inicia sesión</Link> o{' '}
              <Link to="/register" style={{ color: '#2f80ff' }}>regístrate</Link> para continuar
            </p>
          )}

          <button onClick={clearCart} style={s.clearBtn}>Vaciar carrito</button>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  title: { color: '#f0f4ff', fontWeight: '700', fontSize: '1.75rem', letterSpacing: '-0.03em' },
  itemCount: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#8b96a8', padding: '3px 10px', borderRadius: '99px', fontSize: '0.8rem',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
    color: '#fca5a5', borderRadius: '8px', padding: '12px 16px',
    fontSize: '0.875rem', marginBottom: '1.5rem',
  },
  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  item: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '12px', padding: '1rem 1.25rem',
  },
  itemImg: {
    width: '48px', height: '48px', borderRadius: '8px',
    background: '#111820', border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  itemBody: { flex: 1, minWidth: 0 },
  itemName: { color: '#f0f4ff', fontWeight: '500', fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  itemUnit: { color: '#4a5568', fontSize: '0.78rem', margin: '3px 0 0' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 },
  qtyBtn: {
    width: '28px', height: '28px', borderRadius: '6px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#8b96a8', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  qty: { color: '#f0f4ff', fontWeight: '600', fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' },
  itemTotal: { color: '#f0f4ff', fontWeight: '700', fontSize: '0.9rem', minWidth: '80px', textAlign: 'right', fontFamily: 'var(--mono, monospace)' },
  removeBtn: {
    background: 'transparent', border: 'none', color: '#4a5568',
    padding: '4px', display: 'flex', alignItems: 'center',
    transition: 'color 0.15s',
  },
  summary: {
    background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px', padding: '1.5rem',
    position: 'sticky', top: '80px',
  },
  summaryTitle: { color: '#f0f4ff', fontWeight: '600', fontSize: '0.95rem', marginBottom: '1.25rem' },
  summaryRows: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', gap: '1rem' },
  summaryLabel: { color: '#4a5568', fontSize: '0.82rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  summaryVal: { color: '#8b96a8', fontSize: '0.82rem', fontFamily: 'var(--mono, monospace)', flexShrink: 0 },
  divider: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '1rem 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  totalLabel: { color: '#f0f4ff', fontWeight: '600' },
  totalVal: { color: '#2f80ff', fontWeight: '800', fontSize: '1.25rem', fontFamily: 'var(--mono, monospace)', letterSpacing: '-0.02em' },
  checkoutBtn: {
    width: '100%', background: '#2f80ff', color: '#fff', border: 'none',
    padding: '12px', borderRadius: '9px', fontWeight: '600', fontSize: '0.9rem',
    boxShadow: '0 0 20px rgba(47,128,255,0.3)', marginBottom: '0.75rem',
    transition: 'opacity 0.15s',
  },
  loginNote: { color: '#4a5568', fontSize: '0.78rem', textAlign: 'center', marginBottom: '0.75rem' },
  clearBtn: {
    width: '100%', background: 'transparent',
    border: '1px solid rgba(255,255,255,0.06)', color: '#4a5568',
    padding: '9px', borderRadius: '9px', fontSize: '0.82rem',
  },
  emptyPage: { minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' },
  emptyIcon: {
    width: '72px', height: '72px', borderRadius: '18px',
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem',
  },
  emptyTitle: { color: '#8b96a8', fontWeight: '600', fontSize: '1rem' },
  emptySub: { color: '#4a5568', fontSize: '0.85rem' },
  emptyBtn: {
    background: '#2f80ff', color: '#fff', padding: '10px 24px',
    borderRadius: '8px', fontWeight: '600', fontSize: '0.875rem', marginTop: '0.5rem',
    boxShadow: '0 0 16px rgba(47,128,255,0.3)',
  },
}

export default Cart