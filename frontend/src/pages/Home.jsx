import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div style={styles.wrapper}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Bienvenido a ShopAPI</h1>
        <p style={styles.sub}>Tu tienda online con los mejores productos</p>
        <div style={styles.actions}>
          <Link to="/products" style={styles.btnPrimary}>Ver productos</Link>
          {!user && <Link to="/register" style={styles.btnSecondary}>Crear cuenta</Link>}
          {user && <Link to="/orders" style={styles.btnSecondary}>Mis órdenes</Link>}
        </div>
      </div>

      <div style={styles.features}>
        {[
          { icon: '🛍️', title: 'Amplio catálogo', desc: 'Encuentra todo lo que necesitas' },
          { icon: '🔒', title: 'Compra segura', desc: 'Tus datos siempre protegidos' },
          { icon: '🚀', title: 'Envío rápido', desc: 'Recibe tu pedido en tiempo récord' },
        ].map((f) => (
          <div key={f.title} style={styles.featureCard}>
            <span style={styles.featureIcon}>{f.icon}</span>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrapper: { padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' },
  hero: { textAlign: 'center', padding: '4rem 0 3rem' },
  title: { color: '#f1f5f9', fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' },
  sub: { color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' },
  actions: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    background: '#3b82f6', color: '#fff', textDecoration: 'none',
    padding: '12px 28px', borderRadius: '8px', fontWeight: '600',
  },
  btnSecondary: {
    background: 'transparent', color: '#94a3b8', textDecoration: 'none',
    padding: '12px 28px', borderRadius: '8px', fontWeight: '600',
    border: '1px solid #334155',
  },
  features: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2rem' },
  featureCard: {
    background: '#1e293b', border: '1px solid #334155', borderRadius: '10px',
    padding: '1.5rem', textAlign: 'center',
  },
  featureIcon: { fontSize: '2rem' },
  featureTitle: { color: '#f1f5f9', fontWeight: '600', margin: '0.75rem 0 0.5rem' },
  featureDesc: { color: '#64748b', fontSize: '0.9rem', margin: 0 },
}

export default Home