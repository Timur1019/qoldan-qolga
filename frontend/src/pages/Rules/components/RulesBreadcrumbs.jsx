import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'
import styles from './RulesBreadcrumbs.module.css'

export default function RulesBreadcrumbs({ t, current }) {
  return (
    <nav className={styles.nav} aria-label="breadcrumb">
      <Link to={ROUTES.HOME} className={styles.link}>{t('rules.home')}</Link>
      <span className={styles.sep} aria-hidden>/</span>
      {current ? (
        <>
          <Link to={ROUTES.RULES} className={styles.link}>{t('rules.pageTitle')}</Link>
          <span className={styles.sep} aria-hidden>/</span>
          <span className={styles.current}>{current}</span>
        </>
      ) : (
        <span className={styles.current}>{t('rules.pageTitle')}</span>
      )}
    </nav>
  )
}
