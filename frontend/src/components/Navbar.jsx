import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>ShopAPI</Link>

      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Productos</Link>

        {user ? (
          <>
            <Link to="/cart" style={styles.link}>
              Carrito {count > 0 && <span style={styles.badge}>{count}</span>}
            </Link>
            <Link to="/orders" style={styles.link}>Mis órdenes</Link>
            {user.role === 'ADMIN' && (
              <Link to="/admin" style={{ ...styles.link, color: '#f59e0b' }}>Admin</Link>
            )}
            <span style={styles.userName}>{user.name}</span>
            <button onClick={handleLogout} style={styles.btn}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Iniciar sesión</Link>
            <Link to="/register" style={{ ...styles.link, ...styles.btnPrimary }}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2rem', height: '60px', background: '#1e293b',
    position: 'sticky', top: 0, zIndex: 100,
  },
  logo: {
    color: '#f8fafc', fontWeight: '700', fontSize: '1.2rem',
    textDecoration: 'none', letterSpacing: '0.05em',
  },
  links: { display: 'flex', alignItems: 'center', gap: '1.25rem' },
  link: { color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' },
  badge: {
    background: '#3b82f6', color: '#fff', borderRadius: '999px',
    padding: '1px 6px', fontSize: '11px', marginLeft: '4px',
  },
  userName: { color: '#cbd5e1', fontSize: '0.85rem' },
  btn: {
    background: 'transparent', border: '1px solid #475569', color: '#94a3b8',
    padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
  },
  btnPrimary: {
    background: '#3b82f6', color: '#fff', padding: '4px 14px',
    borderRadius: '6px', fontWeight: '500',
  },
}

export default Navbar