import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { PARAMS, ROUTES } from '../../constants/routes'

/**
 * Рендерит children только для пользователей с ролью ADMIN.
 * Иначе редирект на /dashboard или на главную с ?auth=login.
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
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

  if (!isAdmin) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return children
}
