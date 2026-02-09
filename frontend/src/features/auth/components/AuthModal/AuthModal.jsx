import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'
import { useLang } from '../../../../context/LangContext'
import { authApi } from '../../services/authApi'
import styles from './AuthModal.module.css'

export default function AuthModal({ open, onClose, initialMode = 'login' }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { setAuth } = useAuth()
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

  const redirectTo = searchParams.get('from') || '/dashboard'

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
      next.delete('auth')
      next.delete('from')
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
      }, rememberMe)
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
      })
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
      next.set('auth', newMode)
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
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label={t('common.cancel')}
        >
          ×
        </button>
        <h2 id="auth-modal-title" className={styles.title}>
          {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
        </h2>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className={styles.form}>
            {error && <p className={styles.error}>{error}</p>}
            <label className={styles.label}>
              {t('auth.email')}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              {t('auth.password')}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={styles.input}
              />
            </label>
            <label className={styles.rememberRow}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={styles.checkbox}
              />
              <span>{t('auth.rememberMe')}</span>
            </label>
            <button type="submit" disabled={submitting} className={styles.submit}>
              {submitting ? t('common.loading') : t('nav.login')}
            </button>
            <p className={styles.footer}>
              {t('auth.noAccount')}{' '}
              <button type="button" className={styles.linkBtn} onClick={() => switchMode('register')}>
                {t('nav.register')}
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
            {error && <p className={styles.error}>{error}</p>}
            <label className={styles.label}>
              {t('auth.displayName')}
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                autoComplete="name"
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              {t('auth.email')}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              {t('auth.password')} (6+)
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className={styles.input}
              />
            </label>
            <button type="submit" disabled={submitting} className={styles.submit}>
              {submitting ? t('common.loading') : t('nav.register')}
            </button>
            <p className={styles.footer}>
              {t('auth.hasAccount')}{' '}
              <button type="button" className={styles.linkBtn} onClick={() => switchMode('login')}>
                {t('nav.login')}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
