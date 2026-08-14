import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useLang } from '../../context/LangContext'
import { useVerificationCallback } from './useVerificationCallback'
import styles from './VerificationCallback.module.css'

export default function VerificationCallback() {
  const { t } = useLang()
  const { error } = useVerificationCallback()

  return (
    <section className={styles.wrap}>
      <div className={`app-card ${styles.card}`}>
        <i className={`bi ${error ? 'bi-shield-x' : 'bi-shield-check'} ${styles.icon}`} aria-hidden />
        <h1 className={styles.title}>
          {error ? t('profile.verificationCallbackError') : t('profile.verificationCallbackTitle')}
        </h1>
        <p className={styles.text}>
          {error || t('profile.verificationCallbackWait')}
        </p>
        {error && (
          <Link to={ROUTES.PROFILE_EDIT} className="btn btn-primary">
            {t('profile.verificationBackToProfile')}
          </Link>
        )}
      </div>
    </section>
  )
}
