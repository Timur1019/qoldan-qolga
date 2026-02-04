import { Outlet, Link, useLocation } from 'react-router-dom'
import styles from './AdminLayout.module.css'

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Админ-панель</h2>
        <nav className={styles.sidebarNav}>
          <Link
            to="/admin"
            className={location.pathname === '/admin' ? styles.active : ''}
          >
            Обзор
          </Link>
        </nav>
        <Link to="/" className={styles.backLink}>
          ← На сайт
        </Link>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
