import { useState, useEffect } from 'react'
import { orderService } from '../services/order.service'

const statusColors = {
  PENDING:   { bg: '#1c1917', color: '#fbbf24', label: 'Pendiente' },
  PAID:      { bg: '#0f2d1a', color: '#4ade80', label: 'Pagado' },
  SHIPPED:   { bg: '#0c2340', color: '#60a5fa', label: 'Enviado' },
  DELIVERED: { bg: '#0f2d1a', color: '#34d399', label: 'Entregado' },
  CANCELLED: { bg: '#2d0f0f', color: '#f87171', label: 'Cancelado' },
}

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getAll()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const formatPrice = (price) =>
    Number(price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

  if (loading) return <div style={styles.msg}>Cargando órdenes...</div>

  if (orders.length === 0) return <div style={styles.msg}>No tienes órdenes todavía.</div>

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Mis órdenes</h2>

      <div style={styles.list}>
        {orders.map((order) => {
          const st = statusColors[order.status] || statusColors.PENDING
          return (
            <div key={order.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.orderId}>Orden #{order.id}</span>
                <span style={{ ...styles.badge, background: st.bg, color: st.color }}>{st.label}</span>
                <span style={styles.date}>{formatDate(order.createdAt)}</span>
              </div>

              <div style={styles.itemsList}>
                {order.items.map((item) => (
                  <div key={item.id} style={styles.item}>
                    <span style={styles.itemName}>{item.product.name}</span>
                    <span style={styles.itemQty}>x{item.quantity}</span>
                    <span style={styles.itemPrice}>{formatPrice(Number(item.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={styles.cardFooter}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.total}>{formatPrice(order.total)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  wrapper: { padding: '2rem', maxWidth: '800px', margin: '0 auto' },
  title: { color: '#f1f5f9', marginBottom: '1.5rem', fontWeight: '700', fontSize: '1.5rem' },
  msg: { color: '#64748b', textAlign: 'center', padding: '3rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', overflow: 'hidden' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderBottom: '1px solid #334155' },
  orderId: { color: '#f1f5f9', fontWeight: '600', flex: 1 },
  badge: { padding: '3px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '500' },
  date: { color: '#64748b', fontSize: '0.85rem' },
  itemsList: { padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  item: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  itemName: { color: '#94a3b8', flex: 1, fontSize: '0.9rem' },
  itemQty: { color: '#64748b', fontSize: '0.85rem' },
  itemPrice: { color: '#cbd5e1', fontSize: '0.9rem', minWidth: '80px', textAlign: 'right' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1.25rem', borderTop: '1px solid #334155' },
  totalLabel: { color: '#64748b' },
  total: { color: '#3b82f6', fontWeight: '700', fontSize: '1.05rem' },
}

export default Orders