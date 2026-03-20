import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthColors = ['transparent', '#ef4444', '#f59e0b', '#10b981']
  const strengthLabels = ['', 'Débil', 'Regular', 'Fuerte']

  return (
    <div style={s.page}>
      <div style={s.glow} aria-hidden />

      <div className="fade-up" style={s.card}>
        <div style={s.cardTop}>
          <div style={s.logoMark}><span style={s.logoDot} /></div>
          <h1 style={s.title}>Crea tu cuenta</h1>
          <p style={s.sub}>Empieza a comprar en segundos</p>
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
            <label style={s.label}>Nombre completo</label>
            <input
              type="text" required autoComplete="name"
              value={form.name} placeholder="Tu nombre"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

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
              type="password" required minLength={6}
              value={form.password} placeholder="Mínimo 6 caracteres"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {form.password.length > 0 && (
              <div style={s.strengthRow}>
                <div style={s.strengthBar}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ ...s.strengthSegment, background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.06)' }} />
                  ))}
                </div>
                <span style={{ ...s.strengthLabel, color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>

        <p style={s.footer}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={s.link}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' },
  glow: {
    position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
    width: '600px', height: '300px', borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(47,128,255,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%', maxWidth: '420px',
    background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px', padding: '2.5rem',
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
  logoDot: { width: '14px', height: '14px', borderRadius: '50%', background: '#2f80ff', boxShadow: '0 0 12px #2f80ff', display: 'block' },
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
  label: { color: '#8b96a8', fontSize: '0.82rem', fontWeight: '500' },
  strengthRow: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' },
  strengthBar: { display: 'flex', gap: '4px', flex: 1 },
  strengthSegment: { height: '3px', flex: 1, borderRadius: '99px', transition: 'background 0.3s' },
  strengthLabel: { fontSize: '0.75rem', fontWeight: '500', minWidth: '40px', textAlign: 'right' },
  btn: {
    background: '#2f80ff', color: '#fff', border: 'none',
    padding: '12px', borderRadius: '9px', fontWeight: '600', fontSize: '0.9rem',
    marginTop: '0.5rem', boxShadow: '0 0 20px rgba(47,128,255,0.3)',
    transition: 'opacity 0.15s',
  },
  footer: { color: '#4a5568', fontSize: '0.85rem', textAlign: 'center', marginTop: '1.5rem' },
  link: { color: '#2f80ff', fontWeight: '500' },
}

export default Register