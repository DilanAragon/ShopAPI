import { useState, useEffect } from 'react'
import { productService } from '../services/product.service'

const emptyForm = { name: '', description: '', price: '', stock: '', image: '' }

const Admin = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null) // id del producto en edición
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await productService.getAll({ limit: 100 })
      setProducts(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      if (editing) {
        await productService.update(editing, form)
        setSuccess('Producto actualizado correctamente')
      } else {
        await productService.create(form)
        setSuccess('Producto creado correctamente')
      }
      setForm(emptyForm)
      setEditing(null)
      fetchProducts()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product) => {
    setEditing(product.id)
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      image: product.image || '',
    })
    setError('')
    setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return
    try {
      await productService.remove(id)
      setSuccess('Producto eliminado')
      fetchProducts()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar')
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setSuccess('')
  }

  const formatPrice = (price) =>
    Number(price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Panel de administración</h2>

      {/* Formulario */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>{editing ? 'Editar producto' : 'Nuevo producto'}</h3>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Nombre *</label>
              <input
                required style={styles.input}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nombre del producto"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Precio *</label>
              <input
                required type="number" min="0" style={styles.input}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="25000"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Stock</label>
              <input
                type="number" min="0" style={styles.input}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Descripción</label>
            <textarea
              style={{ ...styles.input, height: '80px', resize: 'vertical' }}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descripción del producto"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>URL de imagen</label>
            <input
              type="url" style={styles.input}
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div style={styles.formActions}>
            <button type="submit" disabled={saving} style={styles.btnPrimary}>
              {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear producto'}
            </button>
            {editing && (
              <button type="button" onClick={handleCancel} style={styles.btnSecondary}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla de productos */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Productos ({products.length})</h3>

        {loading ? (
          <p style={styles.msg}>Cargando...</p>
        ) : products.length === 0 ? (
          <p style={styles.msg}>No hay productos.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['ID', 'Nombre', 'Precio', 'Stock', 'Acciones'].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}>#{p.id}</td>
                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}>{formatPrice(p.price)}</td>
                    <td style={styles.td}>
                      <span style={{ color: p.stock === 0 ? '#ef4444' : '#4ade80' }}>
                        {p.stock}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button onClick={() => handleEdit(p)} style={styles.btnEdit}>Editar</button>
                        <button onClick={() => handleDelete(p.id)} style={styles.btnDelete}>Eliminar</button>
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
  )
}

const styles = {
  wrapper: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  title: { color: '#f1f5f9', marginBottom: '1.5rem', fontWeight: '700', fontSize: '1.5rem' },
  card: {
    background: '#1e293b', border: '1px solid #334155', borderRadius: '10px',
    padding: '1.5rem', marginBottom: '1.5rem',
  },
  cardTitle: { color: '#f1f5f9', fontWeight: '600', marginBottom: '1.25rem', fontSize: '1rem' },
  error: { background: '#450a0a', color: '#fca5a5', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' },
  successMsg: { background: '#0f2d1a', color: '#4ade80', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { color: '#94a3b8', fontSize: '0.85rem' },
  input: {
    background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9',
    padding: '9px 12px', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', width: '100%',
  },
  formActions: { display: 'flex', gap: '0.75rem' },
  btnPrimary: {
    background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 24px',
    borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem',
  },
  btnSecondary: {
    background: 'transparent', color: '#94a3b8', border: '1px solid #334155',
    padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem',
  },
  msg: { color: '#64748b', textAlign: 'center', padding: '1rem' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { color: '#64748b', fontSize: '0.8rem', textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #334155', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid #1e293b' },
  td: { color: '#cbd5e1', padding: '10px 12px', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  btnEdit: { background: '#1d4ed8', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  btnDelete: { background: '#7f1d1d', color: '#fca5a5', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
}

export default Admin
