import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { PARAMS, ROUTES } from '../../constants/routes'
import { useAdminLogin } from './useAdminLogin'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, isAdmin, loading, setAuth, refreshUser } = useAuth()
  const { t } = useLang()
  const redirectTo = searchParams.get(PARAMS.FROM) || ROUTES.ADMIN
  const form = useAdminLogin({
    setAuth,
    refreshUser,
    t,
    onSuccess: () => navigate(redirectTo, { replace: true }),
  })

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.muted}>{t('common.loading')}</p>
      </div>
    )
  }

  if (isAuthenticated && isAdmin) {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.head}>
          <span className={styles.icon} aria-hidden>
            <i className="bi bi-shield-lock" />
          </span>
          <h1 className={styles.title}>Вход в админку</h1>
          <p className={styles.muted}>Email и пароль администратора</p>
        </div>

        <form className={styles.form} onSubmit={form.submit}>
          {form.error && (
            <p className={styles.error} role="alert">
              {form.error}
            </p>
          )}
          <label className={styles.label}>
            Email
            <input
              type="email"
              className={styles.input}
              value={form.email}
              onChange={(e) => form.setEmail(e.target.value)}
              autoComplete="username"
              placeholder="admin@qoldan-qolga.uz"
              required
            />
          </label>
          <label className={styles.label}>
            Пароль
            <input
              type="password"
              className={styles.input}
              value={form.password}
              onChange={(e) => form.setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" className={styles.submit} disabled={form.submitting}>
            {form.submitting ? 'Вход…' : 'Войти'}
          </button>
        </form>

        <Link to="/" className={styles.back}>
          ← На сайт
        </Link>
      </div>
    </div>
  )
}
