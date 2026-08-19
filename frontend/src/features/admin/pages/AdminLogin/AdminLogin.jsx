import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LangContext'
import { PARAMS, ROUTES } from '@/constants/routes'
import { UiAlert, UiButton, UiField, UiInput } from '@/shared/ui'
import AdminLangSwitch from '../../components/AdminLangSwitch/AdminLangSwitch'
import { useAdminLogin } from './useAdminLogin'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, isAdmin, loading, setAuth, refreshUser } = useAuth()
  const { t, lang, setLang } = useLang()
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
      <div className={styles.lang}>
        <AdminLangSwitch lang={lang} onChange={setLang} />
      </div>
      <div className={styles.card}>
        <div className={styles.head}>
          <span className={styles.icon} aria-hidden>
            <i className="bi bi-shield-lock" />
          </span>
          <h1 className={styles.title}>{t('adminPanel.loginTitle')}</h1>
          <p className={styles.muted}>{t('adminPanel.loginHint')}</p>
        </div>

        <form className={styles.form} onSubmit={form.submit}>
          {form.error ? <UiAlert compact>{form.error}</UiAlert> : null}
          <UiField label="Email" htmlFor="admin-email">
            <UiInput
              id="admin-email"
              type="email"
              value={form.email}
              onChange={(e) => form.setEmail(e.target.value)}
              autoComplete="username"
              placeholder="admin@qoldan-qolga.uz"
              required
            />
          </UiField>
          <UiField label={t('adminPanel.password')} htmlFor="admin-password">
            <UiInput
              id="admin-password"
              type="password"
              value={form.password}
              onChange={(e) => form.setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </UiField>
          <UiButton type="submit" fullWidth loading={form.submitting} className={styles.submit}>
            {form.submitting ? t('adminPanel.loading') : t('adminPanel.loginBtn')}
          </UiButton>
        </form>

        <Link to="/" className={styles.back}>
          ← {t('adminPanel.toSite')}
        </Link>
      </div>
    </div>
  )
}
