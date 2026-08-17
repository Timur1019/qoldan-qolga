import { Link } from 'react-router-dom'
import { ROUTES } from '../../../../constants/routes'
import styles from './ProfileMobileMenu.module.css'

export default function ProfileMobileMenu({
  t,
  onIdVerification,
  onBusiness,
  onLogout,
}) {
  return (
    <nav className={styles.menu} aria-label={t('nav.profile')}>
      <button type="button" className={styles.item} onClick={onIdVerification}>
        <i className="bi bi-person-badge" aria-hidden />
        <span>{t('profile.idVerification')}</span>
      </button>
      <Link to={ROUTES.REVIEWS_MY} className={styles.item}>
        <i className="bi bi-star" aria-hidden />
        <span>{t('profile.myReviews')}</span>
      </Link>
      <button type="button" className={styles.item} onClick={onBusiness}>
        <i className="bi bi-building" aria-hidden />
        <span>{t('profile.forBusiness')}</span>
      </button>
      <Link to={ROUTES.DASHBOARD_RULES} className={styles.item}>
        <i className="bi bi-file-earmark-text" aria-hidden />
        <span>{t('profile.rules')}</span>
      </Link>
      <button type="button" className={styles.item} onClick={onLogout}>
        <i className="bi bi-box-arrow-right" aria-hidden />
        <span>{t('nav.logout')}</span>
      </button>
    </nav>
  )
}
