import { Link, NavLink } from 'react-router-dom'
import { ADMIN_NAV } from '../AdminLayout/adminNav'
import styles from './AdminSidebar.module.css'

export default function AdminSidebar({ t, onLogout }) {
  return (
    <aside className={styles.sidebar}>
      <Link to="/admin" className={styles.brand}>
        <span className={styles.logo} aria-hidden>
          <i className="bi bi-bag" />
        </span>
        <span className={styles.brandName}>{t('adminPanel.brand')}</span>
      </Link>
      <nav className={styles.nav}>
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <i className={`bi ${item.icon}`} aria-hidden />
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>
      <button type="button" className={styles.logout} onClick={onLogout}>
        <i className="bi bi-box-arrow-left" aria-hidden />
        <span>{t('adminPanel.logout')}</span>
      </button>
    </aside>
  )
}
