import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'

const Wishlist = () => {
    const { wishlist } = useWishlist()

    return (
        <div style={s.page}>
            <div className="fade-up" style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.03em', marginBottom: 4 }}>Mi Lista de Deseos</h1>
                <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>
                    {wishlist.length} {wishlist.length === 1 ? 'producto' : 'productos'} guardados
                </p>
            </div>

            {wishlist.length === 0 ? (
                <div style={s.empty}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border-2)" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <p style={s.emptyText}>No tienes productos en tu lista de deseos</p>
                    <Link to="/products" style={s.btnPrimary}>Explorar productos</Link>
                </div>
            ) : (
                <div style={s.grid}>
                    {wishlist.map((p, i) => (
                        <div key={p.id} className={`fade-up delay-${Math.min(i + 1, 5)}`}>
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const s = {
    page: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
    empty: { textAlign: 'center', padding: '5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
    emptyText: { color: 'var(--text-3)', fontSize: '0.9rem', marginBottom: '1rem' },
    btnPrimary: {
        background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: '8px',
        fontWeight: '600', fontSize: '0.9rem', display: 'inline-flex', boxShadow: '0 0 16px var(--accent-glow)'
    }
}

export default Wishlist
