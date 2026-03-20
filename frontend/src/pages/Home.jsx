import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div style={s.page}>
      {/* Grid de fondo */}
      <div style={s.grid} aria-hidden />

      {/* Hero */}
      <section style={s.hero}>
        <div className="fade-up" style={s.badge}>
          <span style={s.badgeDot} />
          Tienda online — Stack moderno
        </div>

        <h1 className="fade-up delay-1" style={s.h1}>
          El mejor lugar para<br />
          <span style={s.h1Accent}>encontrar lo que buscas</span>
        </h1>

        <p className="fade-up delay-2" style={s.sub}>
          Catálogo completo, compras seguras y entregas rápidas.<br />
          Regístrate y empieza hoy.
        </p>

        <div className="fade-up delay-3" style={s.actions}>
          <Link to="/products" style={s.btnPrimary}>
            Ver productos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 6 }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          {!user
            ? <Link to="/register" style={s.btnGhost}>Crear cuenta gratis</Link>
            : <Link to="/orders" style={s.btnGhost}>Mis órdenes</Link>
          }
        </div>

        {/* Stats */}
        <div className="fade-up delay-4" style={s.stats}>
          {[
            { value: '5+', label: 'Productos' },
            { value: '100%', label: 'Seguro' },
            { value: '24/7', label: 'Disponible' },
          ].map((st) => (
            <div key={st.label} style={s.stat}>
              <span style={s.statValue}>{st.value}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={s.features}>
        {[
          {
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2f80ff" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            ),
            title: 'Catálogo amplio',
            desc: 'Encuentra ropa, calzado y accesorios en un solo lugar.',
          },
          {
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            ),
            title: 'Compra segura',
            desc: 'Autenticación JWT y datos cifrados en todo momento.',
          },
          {
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            ),
            title: 'Envío rápido',
            desc: 'Procesamos tu pedido y lo despachamos en tiempo récord.',
          },
        ].map((f, i) => (
          <div key={f.title} className={`fade-up delay-${i + 2}`} style={s.featureCard}>
            <div style={s.featureIcon}>{f.icon}</div>
            <h3 style={s.featureTitle}>{f.title}</h3>
            <p style={s.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 6rem', position: 'relative', overflow: 'hidden' },
  grid: {
    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
    backgroundImage: `
      linear-gradient(rgba(47,128,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(47,128,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '48px 48px',
  },
  hero: { paddingTop: '7rem', paddingBottom: '5rem', textAlign: 'center', position: 'relative', zIndex: 1 },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(47,128,255,0.08)', border: '1px solid rgba(47,128,255,0.2)',
    color: '#2f80ff', borderRadius: '99px', padding: '5px 14px',
    fontSize: '0.78rem', fontWeight: '600', letterSpacing: '0.04em',
    textTransform: 'uppercase', marginBottom: '1.75rem',
  },
  badgeDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#2f80ff', boxShadow: '0 0 6px #2f80ff' },
  h1: {
    fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: '800',
    lineHeight: 1.1, letterSpacing: '-0.03em',
    color: '#f0f4ff', marginBottom: '1.5rem',
  },
  h1Accent: {
    background: 'linear-gradient(135deg, #2f80ff 0%, #60a5fa 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  sub: { color: '#8b96a8', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' },
  actions: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center',
    background: '#2f80ff', color: '#fff',
    padding: '12px 24px', borderRadius: '9px',
    fontWeight: '600', fontSize: '0.95rem',
    boxShadow: '0 0 24px rgba(47,128,255,0.35)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#8b96a8', padding: '12px 24px', borderRadius: '9px',
    fontWeight: '500', fontSize: '0.95rem',
    transition: 'border-color 0.15s, color 0.15s',
  },
  stats: {
    display: 'flex', justifyContent: 'center', gap: '3rem',
    padding: '1.5rem 2rem',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px', width: 'fit-content', margin: '0 auto',
  },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  statValue: { fontSize: '1.5rem', fontWeight: '800', color: '#f0f4ff', letterSpacing: '-0.03em' },
  statLabel: { fontSize: '0.78rem', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.06em' },
  features: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden',
    position: 'relative', zIndex: 1,
  },
  featureCard: {
    background: '#0d1117', padding: '2rem',
    transition: 'background 0.2s',
  },
  featureIcon: {
    width: '40px', height: '40px', borderRadius: '10px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '1rem',
  },
  featureTitle: { color: '#f0f4ff', fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.5rem' },
  featureDesc: { color: '#4a5568', fontSize: '0.875rem', lineHeight: 1.65 },
}

export default Home