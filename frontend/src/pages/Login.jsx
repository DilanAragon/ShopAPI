import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.glow} aria-hidden />

      <div className="fade-up" style={s.card}>
        <div style={s.cardTop}>
          <div style={s.logoMark}>
            <span style={s.logoDot} />
          </div>
          <h1 style={s.title}>Bienvenido de nuevo</h1>
          <p style={s.sub}>Ingresa a tu cuenta para continuar</p>
        </div>

        {error && (
          <div style={s.errorBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Correo electrónico</label>
            <input
              type="email" required autoComplete="email"
              value={form.email} placeholder="tu@correo.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Contraseña</label>
            <input
              type="password" required autoComplete="current-password"
              value={form.password} placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} style={s.btn}>
            {loading
              ? <><span style={s.spinner} /> Ingresando...</>
              : 'Ingresar'
            }
          </button>
        </form>

        <div style={s.divider}><span>o</span></div>

        {/* Demo credentials */}
        <div style={s.demoBox}>
          <p style={s.demoTitle}>Cuentas de prueba</p>
          <div style={s.demoRow}>
            <button style={s.demoBtn} onClick={() => setForm({ email: 'admin@shopapi.com', password: 'admin123' })}>
              Admin
            </button>
            <button style={s.demoBtn} onClick={() => setForm({ email: 'cliente@shopapi.com', password: 'customer123' })}>
              Cliente
            </button>
          </div>
        </div>

        <p style={s.footer}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={s.link}>Regístrate gratis</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem', position: 'relative',
  },
  glow: {
    position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
    width: '600px', height: '300px', borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(47,128,255,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%', maxWidth: '420px',
    background: '#0d1117',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.5)',
    position: 'relative', zIndex: 1,
  },
  cardTop: { textAlign: 'center', marginBottom: '2rem' },
  logoMark: {
    width: '44px', height: '44px', borderRadius: '12px',
    background: 'rgba(47,128,255,0.1)', border: '1px solid rgba(47,128,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 1.25rem',
  },
  logoDot: {
    width: '14px', height: '14px', borderRadius: '50%',
    background: '#2f80ff', boxShadow: '0 0 12px #2f80ff',
    display: 'block',
  },
  title: { color: '#f0f4ff', fontWeight: '700', fontSize: '1.3rem', letterSpacing: '-0.02em', marginBottom: '0.4rem' },
  sub: { color: '#4a5568', fontSize: '0.875rem' },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
    color: '#fca5a5', borderRadius: '8px', padding: '10px 14px',
    fontSize: '0.85rem', marginBottom: '1.25rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#8b96a8', fontSize: '0.82rem', fontWeight: '500', letterSpacing: '0.01em' },
  btn: {
    background: '#2f80ff', color: '#fff', border: 'none',
    padding: '12px', borderRadius: '9px',
    fontWeight: '600', fontSize: '0.9rem',
    marginTop: '0.5rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    boxShadow: '0 0 20px rgba(47,128,255,0.3)',
    transition: 'opacity 0.15s',
  },
  spinner: {
    width: '14px', height: '14px', borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    margin: '1.5rem 0',
    '::before': { content: '""', flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' },
    color: '#4a5568', fontSize: '0.8rem',
  },
  demoBox: {
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem',
  },
  demoTitle: { color: '#4a5568', fontSize: '0.78rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  demoRow: { display: 'flex', gap: '0.5rem' },
  demoBtn: {
    flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#8b96a8', padding: '7px', borderRadius: '7px',
    fontSize: '0.82rem', fontWeight: '500', transition: 'border-color 0.15s',
  },
  footer: { color: '#4a5568', fontSize: '0.85rem', textAlign: 'center' },
  link: { color: '#2f80ff', fontWeight: '500' },
}

export default Login