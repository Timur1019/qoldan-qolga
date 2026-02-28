import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'
import { useLang } from '../../../../context/LangContext'
import { PARAMS, ROUTES } from '../../../../constants/routes'
import { authApi } from '../../services/authApi'
import styles from './AuthModal.module.css'

export default function AuthModal({ open, onClose, initialMode = 'login' }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { setAuth, refreshUser } = useAuth()
  const { t } = useLang()

  const [mode, setMode] = useState(initialMode)
  useEffect(() => {
    if (open) setMode(initialMode)
  }, [open, initialMode])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = searchParams.get(PARAMS.FROM) || ROUTES.DASHBOARD

  const resetForm = () => {
    setError('')
    setEmail('')
    setPassword('')
    setDisplayName('')
    setRememberMe(true)
  }

  const handleClose = () => {
    resetForm()
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete(PARAMS.AUTH)
      next.delete(PARAMS.FROM)
      return next
    }, { replace: true })
    onClose()
  }

  const handleLogin = async (e) => {
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
      }, rememberMe)
      await refreshUser()
      handleClose()
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || t('common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (e) => {
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
      handleClose()
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || t('common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setError('')
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set(PARAMS.AUTH, newMode)
      return next
    }, { replace: true })
  }

  if (!open) return null

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className={`app-card ${styles.modal}`}>
        <button
          type="button"
          className="btn btn-link position-absolute top-0 end-0 p-2 text-secondary text-decoration-none"
          style={{ top: '0.5rem', right: '0.5rem' }}
          onClick={handleClose}
          aria-label={t('common.cancel')}
        >
          <i className="bi bi-x-lg" aria-hidden />
        </button>
        <h2 id="auth-modal-title" className="h4 mb-4">
          {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
        </h2>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className={styles.form}>
            {error && (
              <div className="alert alert-danger py-2 mb-3" role="alert">
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
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                id="auth-remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="auth-remember">{t('auth.rememberMe')}</label>
            </div>
            <button type="submit" disabled={submitting} className="btn btn-primary w-100">
              {submitting ? t('common.loading') : t('nav.login')}
            </button>
            <p className="mt-3 mb-0 text-muted small text-center">
              {t('auth.noAccount')}{' '}
              <button type="button" className="btn btn-link p-0 align-baseline text-primary text-decoration-none" onClick={() => switchMode('register')}>
                {t('nav.register')}
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
            {error && (
              <div className="alert alert-danger py-2 mb-3" role="alert">
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
            <p className="mt-3 mb-0 text-muted small text-center">
              {t('auth.hasAccount')}{' '}
              <button type="button" className="btn btn-link p-0 align-baseline text-primary text-decoration-none" onClick={() => switchMode('login')}>
                {t('nav.login')}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
