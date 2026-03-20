import { useCart } from '../context/CartContext'

const ProductCard = ({ product }) => {
  const { addItem } = useCart()

  const formatPrice = (price) =>
    Number(price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

  return (
    <div style={styles.card}>
      <div style={styles.img}>
        {product.image
          ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={styles.imgPlaceholder}>Sin imagen</span>
        }
      </div>
      <div style={styles.body}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.desc}>{product.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>{formatPrice(product.price)}</span>
          <span style={styles.stock}>Stock: {product.stock}</span>
        </div>
        <button
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
          style={{ ...styles.btn, ...(product.stock === 0 ? styles.btnDisabled : {}) }}
        >
          {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: '#1e293b', borderRadius: '10px', overflow: 'hidden',
    border: '1px solid #334155', display: 'flex', flexDirection: 'column',
  },
  img: {
    height: '160px', background: '#0f172a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  imgPlaceholder: { color: '#475569', fontSize: '0.85rem' },
  body: { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 },
  name: { color: '#f1f5f9', fontWeight: '600', fontSize: '1rem', margin: 0 },
  desc: { color: '#64748b', fontSize: '0.85rem', margin: 0, flex: 1 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: '#3b82f6', fontWeight: '700', fontSize: '1.1rem' },
  stock: { color: '#64748b', fontSize: '0.8rem' },
  btn: {
    background: '#3b82f6', color: '#fff', border: 'none',
    padding: '8px', borderRadius: '6px', cursor: 'pointer',
    fontWeight: '500', fontSize: '0.9rem', width: '100%',
  },
  btnDisabled: { background: '#334155', color: '#475569', cursor: 'not-allowed' },
}

export default ProductCard