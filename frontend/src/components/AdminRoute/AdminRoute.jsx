import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Рендерит children только для пользователей с ролью ADMIN.
 * Иначе редирект на /dashboard или /login.
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Загрузка…
      </div>
    )
  }

  if (!isAuthenticated) {
    const from = location.pathname + location.search
    return <Navigate to={{ pathname: '/', search: `?auth=login&from=${encodeURIComponent(from)}` }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
