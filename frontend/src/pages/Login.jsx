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
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Iniciar sesión</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email" required style={styles.input}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="correo@ejemplo.com"
          />

          <label style={styles.label}>Contraseña</label>
          <input
            type="password" required style={styles.input}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••"
          />

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p style={styles.footer}>
          ¿No tienes cuenta? <Link to="/register" style={styles.link}>Regístrate</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '400px' },
  title: { color: '#f1f5f9', marginBottom: '1.5rem', fontWeight: '700' },
  error: { background: '#450a0a', color: '#fca5a5', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  label: { color: '#94a3b8', fontSize: '0.85rem' },
  input: {
    background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9',
    padding: '10px 12px', borderRadius: '6px', fontSize: '0.95rem', outline: 'none',
  },
  btn: {
    background: '#3b82f6', color: '#fff', border: 'none', padding: '11px',
    borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', marginTop: '0.5rem',
  },
  footer: { color: '#64748b', fontSize: '0.85rem', textAlign: 'center', marginTop: '1.25rem' },
  link: { color: '#3b82f6', textDecoration: 'none' },
}

export default Login