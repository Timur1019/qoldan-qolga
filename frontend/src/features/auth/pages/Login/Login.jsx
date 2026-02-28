import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'
import { useLang } from '../../../../context/LangContext'
import { authApi } from '../../services/authApi'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth, refreshUser } = useAuth()
  const { t } = useLang()
  const from = location.state?.from?.pathname ?? '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await authApi.login(email, password)
      setAuth(res.token, {
        id: res.userId,
        email: res.email,
        displayName: res.displayName,
        role: res.role || 'USER',
        avatar: res.avatar,
      })
      await refreshUser()
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Ошибка входа')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container app-page">
      <div className={`app-card ${styles.card}`}>
        <h1 className="h2 mb-4">{t('auth.loginTitle')}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className="alert alert-danger py-2" role="alert">
              <i className="bi bi-exclamation-circle me-2" aria-hidden /> {error}
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="form-control"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn btn-primary w-100">
            {submitting ? t('common.loading') : t('nav.login')}
          </button>
        </form>
        <p className="mt-4 mb-0 text-muted small text-center">
          {t('auth.noAccount')} <Link to="/register" className="text-primary text-decoration-none">{t('nav.register')}</Link>
        </p>
      </div>
    </div>
  )
}
