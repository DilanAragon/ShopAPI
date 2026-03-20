import { useState, useEffect, useRef } from 'react'
import { productService } from '../services/product.service'
import { orderService } from '../services/order.service'

const emptyForm = { name: '', description: '', price: '', stock: '', image: '' }

const STATUS_OPTIONS = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const STATUS_META = {
  PENDING:   { label: 'Pendiente',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)' },
  PAID:      { label: 'Pagado',     color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)' },
  SHIPPED:   { label: 'Enviado',    color: '#2f80ff', bg: 'rgba(47,128,255,0.12)',  border: 'rgba(47,128,255,0.3)' },
  DELIVERED: { label: 'Entregado',  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)' },
  CANCELLED: { label: 'Cancelado',  color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)' },
}

// ── Dropdown de estado personalizado ──────────────────
const StatusDropdown = ({ value, onChange, disabled }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = STATUS_META[value] || STATUS_META.PENDING

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (st) => {
    setOpen(false)
    if (st !== value) onChange(st)
  }

  return (
    <div ref={ref} style={{ position: 'relative', userSelect: 'none' }}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: current.bg, border: `1px solid ${current.border}`,
          color: current.color, padding: '6px 10px 6px 12px',
          borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          whiteSpace: 'nowrap', transition: 'opacity 0.15s',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: current.color, flexShrink: 0, boxShadow: `0 0 6px ${current.color}` }} />
        {current.label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ marginLeft: 2, transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Panel desplegable */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 50,
          background: '#111820', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px', padding: '5px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          minWidth: '150px',
          animation: 'fadeUp 0.12s ease both',
        }}>
          {STATUS_OPTIONS.map((st) => {
            const m = STATUS_META[st]
            const isActive = st === value
            return (
              <button
                key={st}
                type="button"
                onClick={() => handleSelect(st)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '9px',
                  width: '100%', padding: '8px 10px', borderRadius: '7px',
                  background: isActive ? m.bg : 'transparent',
                  border: 'none', cursor: 'pointer',
                  color: isActive ? m.color : '#8b96a8',
                  fontSize: '0.82rem', fontWeight: isActive ? 600 : 400,
                  transition: 'background 0.1s, color 0.1s',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#f0f4ff' } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b96a8' } }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                {m.label}
                {isActive && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 'auto' }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Badge de estado (solo lectura) ────────────────────
const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.PENDING
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: m.bg, border: `1px solid ${m.border}`, color: m.color, padding: '3px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: m.color }} />
      {m.label}
    </span>
  )
}

// ── Componente principal ──────────────────────────────
const Admin = () => {
  const [tab, setTab] = useState('products')

  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [updatingOrder, setUpdatingOrder] = useState(null)
  const [orderMsg, setOrderMsg] = useState('')
  const [expandedOrder, setExpandedOrder] = useState(null)

  const fetchProducts = async () => {
    setLoadingProducts(true)
    try { const data = await productService.getAll({ limit: 100 }); setProducts(data.data) }
    catch (err) { console.error(err) }
    finally { setLoadingProducts(false) }
  }

  const fetchOrders = async () => {
    setLoadingOrders(true)
    try { const data = await orderService.getAll(); setOrders(data) }
    catch (err) { console.error(err) }
    finally { setLoadingOrders(false) }
  }

  useEffect(() => { fetchProducts(); fetchOrders() }, [])

  const handleProductSubmit = async (e) => {
    e.preventDefault(); setFormError(''); setFormSuccess(''); setSaving(true)
    try {
      if (editing) { await productService.update(editing, form); setFormSuccess('Producto actualizado') }
      else { await productService.create(form); setFormSuccess('Producto creado') }
      setForm(emptyForm); setEditing(null); fetchProducts()
    } catch (err) { setFormError(err.response?.data?.message || 'Error al guardar') }
    finally { setSaving(false) }
  }

  const handleEdit = (p) => {
    setEditing(p.id)
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, image: p.image || '' })
    setFormError(''); setFormSuccess(''); setTab('products')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    try { await productService.remove(id); fetchProducts() }
    catch (err) { setFormError(err.response?.data?.message || 'Error') }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrder(orderId); setOrderMsg('')
    try {
      await orderService.updateStatus(orderId, newStatus)
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o))
      setOrderMsg(`Orden #${orderId} → ${STATUS_META[newStatus].label}`)
      setTimeout(() => setOrderMsg(''), 3000)
    } catch (err) { setOrderMsg(err.response?.data?.message || 'Error al actualizar') }
    finally { setUpdatingOrder(null) }
  }

  const fmt = (p) => Number(p).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
  const fmtDate = (d) => new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="page">
      <div className="fade-up" style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.03em', marginBottom: 4 }}>Panel de administración</h1>
        <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>Gestiona productos y órdenes</p>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {[{ key: 'products', label: 'Productos', count: products.length }, { key: 'orders', label: 'Órdenes', count: orders.length }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ ...s.tab, ...(tab === t.key ? s.tabActive : {}) }}>
            {t.label}
            <span style={{ ...s.badge, ...(tab === t.key ? s.badgeActive : {}) }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── PRODUCTOS ── */}
      {tab === 'products' && (
        <div className="fade-in">
          <div style={s.card}>
            <h3 style={s.cardTitle}>{editing ? 'Editar producto' : 'Nuevo producto'}</h3>
            {formError   && <div style={s.errorBox}>{formError}</div>}
            {formSuccess && <div style={s.successBox}>{formSuccess}</div>}
            <form onSubmit={handleProductSubmit} style={s.form}>
              <div style={s.row3}>
                <div style={s.field}><label style={s.label}>Nombre *</label>
                  <input required value={form.name} placeholder="Nombre" onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div style={s.field}><label style={s.label}>Precio *</label>
                  <input required type="number" min="0" value={form.price} placeholder="25000" onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div style={s.field}><label style={s.label}>Stock</label>
                  <input type="number" min="0" value={form.stock} placeholder="0" onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
              </div>
              <div style={s.field}><label style={s.label}>Descripción</label>
                <textarea style={{ resize: 'vertical', minHeight: '72px' }} value={form.description} placeholder="Descripción"
                  onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div style={s.field}><label style={s.label}>URL de imagen</label>
                <input type="url" value={form.image} placeholder="https://..." onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
              <div style={s.formActions}>
                <button type="submit" disabled={saving} style={s.btnPrimary}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear producto'}</button>
                {editing && <button type="button" style={s.btnGhost} onClick={() => { setEditing(null); setForm(emptyForm); setFormError(''); setFormSuccess('') }}>Cancelar</button>}
              </div>
            </form>
          </div>

          <div style={s.card}>
            <h3 style={s.cardTitle}>Todos los productos ({products.length})</h3>
            {loadingProducts ? <p style={s.msg}>Cargando...</p> : (
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead><tr>{['ID', 'Nombre', 'Precio', 'Stock', 'Estado', 'Acciones'].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} style={s.tr}>
                        <td style={{ ...s.td, color: '#4a5568', fontFamily: 'var(--mono)' }}>#{p.id}</td>
                        <td style={s.td}>{p.name}</td>
                        <td style={{ ...s.td, fontFamily: 'var(--mono)' }}>{fmt(p.price)}</td>
                        <td style={s.td}><span style={{ color: p.stock === 0 ? '#ef4444' : p.stock <= 5 ? '#f59e0b' : '#10b981', fontWeight: 600 }}>{p.stock}</span></td>
                        <td style={s.td}><span style={{ color: p.active ? '#10b981' : '#4a5568', fontSize: '0.8rem' }}>{p.active ? 'Activo' : 'Inactivo'}</span></td>
                        <td style={s.td}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleEdit(p)} style={s.btnEdit}>Editar</button>
                            <button onClick={() => handleDelete(p.id)} style={s.btnDelete}>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ÓRDENES ── */}
      {tab === 'orders' && (
        <div className="fade-in">
          {orderMsg && <div style={{ ...s.successBox, marginBottom: '1.25rem' }}>{orderMsg}</div>}
          {loadingOrders ? <p style={s.msg}>Cargando órdenes...</p>
          : orders.length === 0 ? <p style={s.msg}>No hay órdenes todavía.</p>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {orders.map((order) => (
                <div key={order.id} style={s.orderCard}>
                  <div style={s.orderHeader}>
                    <div style={s.orderLeft}>
                      <span style={s.orderId}>#{order.id}</span>
                      <StatusBadge status={order.status} />
                      <span style={s.orderUser}>{order.user?.name}</span>
                      <span style={s.orderDate}>{fmtDate(order.createdAt)}</span>
                    </div>
                    <div style={s.orderRight}>
                      <span style={s.orderTotal}>{fmt(order.total)}</span>
                      <StatusDropdown
                        value={order.status}
                        onChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                        disabled={updatingOrder === order.id}
                      />
                      <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} style={s.expandBtn}>
                        {expandedOrder === order.id ? 'Ocultar' : `Ver ${order.items?.length || 0} items`}
                      </button>
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div style={s.orderItems} className="fade-in">
                      <div style={{ display: 'flex', padding: '0 0 8px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '4px' }}>
                        <span style={s.colHeader}>Producto</span>
                        <span style={{ ...s.colHeader, width: '60px', textAlign: 'center' }}>Cant.</span>
                        <span style={{ ...s.colHeader, width: '100px', textAlign: 'right' }}>Subtotal</span>
                      </div>
                      {order.items.map((item) => (
                        <div key={item.id} style={s.orderItem}>
                          <span style={s.orderItemName}>{item.product?.name}</span>
                          <span style={s.orderItemQty}>×{item.quantity}</span>
                          <span style={s.orderItemPrice}>{fmt(Number(item.price) * item.quantity)}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '4px' }}>
                        <span style={{ color: '#2f80ff', fontWeight: 700, fontFamily: 'var(--mono)', fontSize: '0.9rem' }}>Total: {fmt(order.total)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const s = {
  tabs: { display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 0 },
  tab: { display: 'flex', alignItems: 'center', gap: '7px', background: 'transparent', border: 'none', color: '#4a5568', padding: '10px 18px', fontSize: '0.875rem', fontWeight: 500, borderBottom: '2px solid transparent', marginBottom: '-1px', borderRadius: '8px 8px 0 0', transition: 'color 0.15s' },
  tabActive: { color: '#f0f4ff', borderBottomColor: '#2f80ff' },
  badge: { padding: '2px 7px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(255,255,255,0.05)', color: '#4a5568' },
  badgeActive: { background: 'rgba(47,128,255,0.15)', color: '#2f80ff' },
  card: { background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.25rem' },
  cardTitle: { color: '#f0f4ff', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1.25rem' },
  errorBox: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', marginBottom: '1rem' },
  successBox: { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  row3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#8b96a8', fontSize: '0.82rem', fontWeight: 500 },
  formActions: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  btnPrimary: { background: '#2f80ff', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 0 16px rgba(47,128,255,0.2)' },
  btnGhost: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#8b96a8', padding: '10px 22px', borderRadius: '8px', fontSize: '0.875rem' },
  msg: { color: '#4a5568', textAlign: 'center', padding: '3rem' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '520px' },
  th: { color: '#4a5568', fontSize: '0.72rem', textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)' },
  td: { color: '#cbd5e1', padding: '11px 12px', fontSize: '0.875rem' },
  btnEdit: { background: 'rgba(47,128,255,0.1)', border: '1px solid rgba(47,128,255,0.2)', color: '#2f80ff', padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 },
  btnDelete: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 },
  orderCard: { background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'visible' },
  orderHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', gap: '1rem', flexWrap: 'wrap' },
  orderLeft: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  orderId: { color: '#f0f4ff', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--mono)' },
  orderUser: { color: '#8b96a8', fontSize: '0.82rem' },
  orderDate: { color: '#4a5568', fontSize: '0.78rem' },
  orderRight: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  orderTotal: { color: '#2f80ff', fontWeight: 700, fontFamily: 'var(--mono)', fontSize: '0.9rem' },
  expandBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#8b96a8', padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', whiteSpace: 'nowrap' },
  orderItems: { borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  colHeader: { color: '#4a5568', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', flex: 1 },
  orderItem: { display: 'flex', alignItems: 'center', gap: '1rem' },
  orderItemName: { color: '#8b96a8', flex: 1, fontSize: '0.85rem' },
  orderItemQty: { color: '#4a5568', fontSize: '0.82rem', width: '60px', textAlign: 'center' },
  orderItemPrice: { color: '#cbd5e1', fontSize: '0.85rem', fontFamily: 'var(--mono)', width: '100px', textAlign: 'right' },
}

export default Admin