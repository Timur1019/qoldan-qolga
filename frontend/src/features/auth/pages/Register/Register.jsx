import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'
import { useLang } from '../../../../context/LangContext'
import { authApi } from '../../services/authApi'
import styles from './Register.module.css'

export default function Register() {
  const navigate = useNavigate()
  const { setAuth, refreshUser } = useAuth()
  const { t } = useLang()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await authApi.register({ email, password, displayName })
      setAuth(res.token, {
        id: res.userId,
        email: res.email,
        displayName: res.displayName,
        role: res.role || 'USER',
        avatar: res.avatar,
      })
      await refreshUser()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Ошибка регистрации')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container app-page">
      <div className={`app-card ${styles.card}`}>
        <h1 className="h2 mb-4">{t('auth.registerTitle')}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className="alert alert-danger py-2" role="alert">
              <i className="bi bi-exclamation-circle me-2" aria-hidden /> {error}
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">{t('auth.displayName')}</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoComplete="name"
              className="form-control"
            />
          </div>
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
            <label className="form-label">{t('auth.password')} (6+)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="form-control"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn btn-primary w-100">
            {submitting ? t('common.loading') : t('nav.register')}
          </button>
        </form>
        <p className="mt-4 mb-0 text-muted small text-center">
          {t('auth.hasAccount')} <Link to="/login" className="text-primary text-decoration-none">{t('nav.login')}</Link>
        </p>
      </div>
    </div>
  )
}
