import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate('/login') }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>
          <span style={s.logoDot} />
          ShopAPI
        </Link>

        <div style={s.center}>
          <Link to="/products" style={{ ...s.navLink, ...(isActive('/products') ? s.navLinkActive : {}) }}>
            Productos
          </Link>
          {user && (
            <>
              <Link to="/wishlist" style={{ ...s.navLink, ...(isActive('/wishlist') ? s.navLinkActive : {}) }}>
                Lista de deseos
              </Link>
              <Link to="/orders" style={{ ...s.navLink, ...(isActive('/orders') ? s.navLinkActive : {}) }}>
                Órdenes
              </Link>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <Link to="/admin" style={{ ...s.navLink, color: '#f59e0b', ...(isActive('/admin') ? { opacity: 1 } : {}) }}>
              Admin
            </Link>
          )}
        </div>

        <div style={s.right}>
          <button onClick={toggleTheme} style={s.iconBtn} aria-label="Toggle Theme">
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </button>

          {user ? (
            <>
              <Link to="/cart" style={s.cartBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {count > 0 && <span style={s.cartBadge}>{count}</span>}
              </Link>
              <div style={s.userChip}>
                <div style={s.avatar}>{user.name[0].toUpperCase()}</div>
                <span style={s.userName}>{user.name}</span>
              </div>
              <button onClick={handleLogout} style={s.logoutBtn}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.loginLink}>Iniciar sesión</Link>
              <Link to="/register" style={s.registerBtn}>Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

const s = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(8,12,18,0.85)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  inner: {
    maxWidth: '1200px', margin: '0 auto',
    padding: '0 2rem', height: '60px',
    display: 'flex', alignItems: 'center', gap: '2rem',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontWeight: '700', fontSize: '1.05rem', letterSpacing: '-0.02em',
    color: '#f0f4ff', flexShrink: 0,
  },
  logoDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#2f80ff',
    boxShadow: '0 0 8px #2f80ff',
  },
  center: { display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 },
  navLink: {
    color: '#8b96a8', fontSize: '0.88rem', fontWeight: '500',
    padding: '6px 12px', borderRadius: '6px',
    transition: 'color 0.15s, background 0.15s',
    opacity: 0.8,
  },
  navLinkActive: { color: '#f0f4ff', background: 'rgba(255,255,255,0.06)', opacity: 1 },
  right: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' },
  cartBtn: {
    position: 'relative', color: '#8b96a8', display: 'flex',
    padding: '8px', borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.03)',
    transition: 'border-color 0.15s',
  },
  cartBadge: {
    position: 'absolute', top: '-5px', right: '-5px',
    background: '#2f80ff', color: '#fff',
    borderRadius: '99px', fontSize: '10px', fontWeight: '700',
    minWidth: '17px', height: '17px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 4px',
  },
  iconBtn: {
    background: 'transparent', border: 'none', color: 'var(--text-2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '6px', borderRadius: '50%',
    transition: 'color 0.15s, background 0.15s',
  },
  userChip: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '4px 10px 4px 4px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '99px',
  },
  avatar: {
    width: '26px', height: '26px', borderRadius: '50%',
    background: '#2f80ff', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '700',
  },
  userName: { color: '#8b96a8', fontSize: '0.82rem' },
  logoutBtn: {
    background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
    color: '#8b96a8', padding: '6px 14px', borderRadius: '6px',
    fontSize: '0.82rem', transition: 'border-color 0.15s, color 0.15s',
  },
  loginLink: { color: '#8b96a8', fontSize: '0.88rem', padding: '6px 12px' },
  registerBtn: {
    background: '#2f80ff', color: '#fff',
    padding: '7px 16px', borderRadius: '7px',
    fontSize: '0.85rem', fontWeight: '600',
    boxShadow: '0 0 16px rgba(47,128,255,0.3)',
    transition: 'background 0.15s',
  },
}

export default Navbar