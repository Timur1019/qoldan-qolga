import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { PARAMS } from '../../constants/routes'

/**
 * Рендерит children только для авторизованных пользователей.
 * Иначе редирект на / с ?auth=login и returnUrl.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const { t } = useLang()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        {t('common.loading')}
      </div>
    )
  }

  if (!isAuthenticated) {
    const from = location.pathname + location.search
    return <Navigate to={{ pathname: '/', search: `?${PARAMS.AUTH}=login&${PARAMS.FROM}=${encodeURIComponent(from)}` }} replace />
  }

  return children
}
