import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/order.service'

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatPrice = (price) =>
    Number(price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

  const handleCheckout = async () => {
    if (!user) return navigate('/login')
    setError('')
    setLoading(true)
    try {
      const orderItems = items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      const order = await orderService.create(orderItems)
      clearCart()
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la orden')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>Tu carrito está vacío</p>
        <button onClick={() => navigate('/products')} style={styles.btnPrimary}>
          Ver productos
        </button>
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Carrito</h2>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.layout}>
        <div style={styles.items}>
          {items.map((item) => (
            <div key={item.productId} style={styles.item}>
              <div style={styles.itemInfo}>
                <span style={styles.itemName}>{item.name}</span>
                <span style={styles.itemPrice}>{formatPrice(item.price)} c/u</span>
              </div>
              <div style={styles.itemActions}>
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} style={styles.qtyBtn}>-</button>
                <span style={styles.qty}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} style={styles.qtyBtn}>+</button>
                <button onClick={() => removeItem(item.productId)} style={styles.removeBtn}>Quitar</button>
              </div>
              <span style={styles.subtotal}>{formatPrice(Number(item.price) * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Resumen</h3>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Total</span>
            <span style={styles.summaryTotal}>{formatPrice(total)}</span>
          </div>
          <button onClick={handleCheckout} disabled={loading} style={styles.btnPrimary}>
            {loading ? 'Procesando...' : 'Confirmar orden'}
          </button>
          {!user && <p style={styles.loginNote}>Debes iniciar sesión para comprar</p>}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  title: { color: '#f1f5f9', marginBottom: '1.5rem', fontWeight: '700', fontSize: '1.5rem' },
  error: { background: '#450a0a', color: '#fca5a5', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' },
  items: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  item: {
    background: '#1e293b', border: '1px solid #334155', borderRadius: '8px',
    padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem',
  },
  itemInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  itemName: { color: '#f1f5f9', fontWeight: '500' },
  itemPrice: { color: '#64748b', fontSize: '0.85rem' },
  itemActions: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  qtyBtn: {
    background: '#334155', color: '#f1f5f9', border: 'none',
    width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem',
  },
  qty: { color: '#f1f5f9', minWidth: '24px', textAlign: 'center' },
  removeBtn: { background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '0.85rem' },
  subtotal: { color: '#3b82f6', fontWeight: '600', minWidth: '80px', textAlign: 'right' },
  summary: {
    background: '#1e293b', border: '1px solid #334155', borderRadius: '10px',
    padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
  },
  summaryTitle: { color: '#f1f5f9', fontWeight: '700', margin: 0 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: '#94a3b8' },
  summaryTotal: { color: '#3b82f6', fontWeight: '700', fontSize: '1.2rem' },
  btnPrimary: {
    background: '#3b82f6', color: '#fff', border: 'none', padding: '11px',
    borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', width: '100%',
  },
  loginNote: { color: '#64748b', fontSize: '0.8rem', textAlign: 'center', margin: 0 },
  empty: { minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' },
  emptyText: { color: '#64748b', fontSize: '1.1rem' },
}

export default Cart