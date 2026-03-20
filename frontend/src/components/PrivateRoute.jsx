import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth()

  if (loading) return <div style={{ padding: '2rem' }}>Cargando...</div>

  if (!user) return <Navigate to="/login" replace />

  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace />

  return children
}

export default PrivateRoute