import { Link } from 'react-router-dom'
import AdminLangSwitch from '../AdminLangSwitch/AdminLangSwitch'
import styles from './AdminHeader.module.css'

export default function AdminHeader({ t, lang, onLangChange }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.icon} aria-hidden>
          <i className="bi bi-shield-lock" />
        </span>
        <h1 className={styles.title}>{t('adminPanel.title')}</h1>
      </div>
      <div className={styles.right}>
        <AdminLangSwitch lang={lang} onChange={onLangChange} />
        <Link to="/" className={styles.toSite}>
          ← {t('adminPanel.toSite')}
        </Link>
      </div>
    </header>
  )
}
