import { useState, useEffect } from 'react'
import { productService } from '../services/product.service'
import ProductCard from '../components/ProductCard'

const Products = () => {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const fetchProducts = async (q = search, p = page) => {
    setLoading(true)
    try {
      const data = await productService.getAll({ page: p, search: q || undefined })
      setProducts(data.data)
      setPagination(data.pagination)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts(search, page) }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchProducts(search, 1)
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header} className="fade-up">
        <div>
          <h1 style={s.title}>Productos</h1>
          <p style={s.sub}>
            {pagination.total !== undefined
              ? `${pagination.total} productos disponibles`
              : 'Cargando catálogo...'}
          </p>
        </div>

        <form onSubmit={handleSearch} style={s.searchForm}>
          <div style={s.searchWrap}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={s.searchIcon}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text" placeholder="Buscar productos..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={s.searchInput}
            />
          </div>
          <button type="submit" style={s.searchBtn}>Buscar</button>
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={s.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={s.skeleton} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div style={s.empty}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p style={s.emptyText}>No se encontraron productos</p>
          {search && (
            <button onClick={() => { setSearch(''); fetchProducts('', 1) }} style={s.clearBtn}>
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div style={s.grid}>
          {products.map((p, i) => (
            <div key={p.id} className={`fade-up delay-${Math.min(i + 1, 5)}`}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div style={s.pagination}>
          <button
            onClick={() => setPage((p) => p - 1)} disabled={page === 1}
            style={{ ...s.pageBtn, ...(page === 1 ? s.pageBtnDisabled : {}) }}
          >← Anterior</button>
          <span style={s.pageInfo}>
            Página <strong style={{ color: '#f0f4ff' }}>{page}</strong> de {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)} disabled={page === pagination.totalPages}
            style={{ ...s.pageBtn, ...(page === pagination.totalPages ? s.pageBtnDisabled : {}) }}
          >Siguiente →</button>
        </div>
      )}
    </div>
  )
}

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' },
  header: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' },
  title: { color: '#f0f4ff', fontWeight: '700', fontSize: '1.75rem', letterSpacing: '-0.03em', marginBottom: '4px' },
  sub: { color: '#4a5568', fontSize: '0.875rem' },
  searchForm: { display: 'flex', gap: '0.5rem', flexShrink: 0 },
  searchWrap: { position: 'relative' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4a5568', pointerEvents: 'none' },
  searchInput: {
    background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f4ff',
    padding: '10px 14px 10px 36px', borderRadius: '9px', fontSize: '0.875rem',
    width: '240px', outline: 'none',
  },
  searchBtn: {
    background: 'rgba(47,128,255,0.1)', border: '1px solid rgba(47,128,255,0.2)',
    color: '#2f80ff', padding: '10px 18px', borderRadius: '9px',
    fontSize: '0.875rem', fontWeight: '600', whiteSpace: 'nowrap',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
  skeletonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
  skeleton: {
    height: '280px', borderRadius: '14px',
    background: 'linear-gradient(90deg, #0d1117 25%, #111820 50%, #0d1117 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
  },
  empty: { textAlign: 'center', padding: '5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  emptyText: { color: '#4a5568', fontSize: '0.9rem' },
  clearBtn: {
    background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
    color: '#8b96a8', padding: '7px 16px', borderRadius: '7px', fontSize: '0.82rem',
  },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' },
  pageBtn: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#8b96a8', padding: '8px 18px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500',
  },
  pageBtnDisabled: { opacity: 0.35, cursor: 'not-allowed' },
  pageInfo: { color: '#4a5568', fontSize: '0.85rem' },
}

export default Products