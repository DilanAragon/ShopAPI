import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

const ProductCard = ({ product }) => {
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  const [added, setAdded] = useState(false)

  const formatPrice = (price) =>
    Number(price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div style={s.card}>
      <div style={s.img}>
        {product.image
          ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (
            <div style={s.imgPlaceholder}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )
        }
        {product.stock <= 5 && product.stock > 0 && (
          <div style={s.lowStock}>Últimas {product.stock}</div>
        )}
        {product.stock === 0 && (
          <div style={s.noStock}>Sin stock</div>
        )}

        {user && (
          <button
            onClick={() => toggleWishlist(product)}
            style={s.wishlistBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "var(--danger)" : "none"} stroke={isInWishlist(product.id) ? "var(--danger)" : "rgba(255,255,255,0.7)"} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        )}
      </div>

      <div style={s.body}>
        <p style={s.name}>{product.name}</p>
        {product.description && <p style={s.desc}>{product.description}</p>}

        <div style={s.footer}>
          <span style={s.price}>{formatPrice(product.price)}</span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            style={{
              ...s.btn,
              ...(product.stock === 0 ? s.btnDisabled : {}),
              ...(added ? s.btnAdded : {}),
            }}
          >
            {added ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Agregado
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  card: {
    background: '#0d1117',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '14px', overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    transition: 'border-color 0.2s, transform 0.2s',
  },
  img: {
    height: '170px', background: '#111820', position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  imgPlaceholder: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
  lowStock: {
    position: 'absolute', top: '10px', right: '10px',
    background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
    color: '#f59e0b', borderRadius: '6px', padding: '3px 8px', fontSize: '0.72rem', fontWeight: '600',
  },
  noStock: {
    position: 'absolute', inset: 0,
    background: 'rgba(8,12,18,0.7)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#4a5568', fontSize: '0.85rem', fontWeight: '500',
  },
  body: { padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 },
  name: { color: '#f0f4ff', fontWeight: '600', fontSize: '0.92rem', margin: 0, letterSpacing: '-0.01em' },
  desc: { color: '#4a5568', fontSize: '0.8rem', margin: 0, lineHeight: 1.5, flex: 1 },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' },
  price: { color: '#f0f4ff', fontWeight: '700', fontSize: '1rem', fontFamily: 'var(--mono, monospace)', letterSpacing: '-0.02em' },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    background: 'rgba(47,128,255,0.1)', border: '1px solid rgba(47,128,255,0.25)',
    color: '#2f80ff', padding: '6px 12px', borderRadius: '7px',
    fontSize: '0.8rem', fontWeight: '600', transition: 'all 0.2s',
  },
  btnDisabled: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    color: '#4a5568', cursor: 'not-allowed',
  },
  btnAdded: {
    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
    color: '#10b981',
  },
  wishlistBtn: {
    position: 'absolute', top: '10px', left: '10px',
    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(4px)',
    padding: '6px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform 0.2s',
  }
}

export default ProductCard