import { useState, useEffect } from 'react'
import { productService } from '../services/product.service'
import ProductCard from '../components/ProductCard'

const Products = () => {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await productService.getAll({ page, search: search || undefined })
      setProducts(data.data)
      setPagination(data.pagination)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Productos</h2>

      <form onSubmit={handleSearch} style={styles.searchBar}>
        <input
          type="text" placeholder="Buscar productos..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchBtn}>Buscar</button>
      </form>

      {loading ? (
        <div style={styles.msg}>Cargando productos...</div>
      ) : products.length === 0 ? (
        <div style={styles.msg}>No se encontraron productos.</div>
      ) : (
        <>
          <div style={styles.grid}>
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setPage((p) => p - 1)} disabled={page === 1}
                style={styles.pageBtn}
              >← Anterior</button>
              <span style={styles.pageInfo}>Página {page} de {pagination.totalPages}</span>
              <button
                onClick={() => setPage((p) => p + 1)} disabled={page === pagination.totalPages}
                style={styles.pageBtn}
              >Siguiente →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const styles = {
  wrapper: { padding: '2rem', maxWidth: '1100px', margin: '0 auto' },
  title: { color: '#f1f5f9', marginBottom: '1.5rem', fontWeight: '700', fontSize: '1.5rem' },
  searchBar: { display: 'flex', gap: '0.5rem', marginBottom: '2rem' },
  searchInput: {
    flex: 1, background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9',
    padding: '10px 14px', borderRadius: '6px', fontSize: '0.95rem', outline: 'none',
  },
  searchBtn: {
    background: '#3b82f6', color: '#fff', border: 'none',
    padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' },
  msg: { color: '#64748b', textAlign: 'center', padding: '3rem' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' },
  pageBtn: {
    background: '#1e293b', color: '#94a3b8', border: '1px solid #334155',
    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
  },
  pageInfo: { color: '#64748b', fontSize: '0.9rem' },
}

export default Products