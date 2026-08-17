import { Outlet, Link, useLocation } from 'react-router-dom'
import styles from './AdminLayout.module.css'

export default function AdminLayout() {
  const location = useLocation()
  const navLink = (path, label) => (
    <Link
      to={path}
      className={`nav-link py-2 rounded ${location.pathname === path ? 'active bg-primary text-white' : 'text-dark'}`}
    >
      {label}
    </Link>
  )

  return (
    <div className={styles.adminLayout}>
      <header className="bg-white border-bottom py-2">
        <div className={styles.headerInner}>
          <span className="d-flex align-items-center justify-content-center rounded bg-light text-primary me-2" style={{ width: 36, height: 36 }}>
            <i className="bi bi-shield-lock" aria-hidden />
          </span>
          <h1 className="h6 mb-0 flex-grow-1 fw-semibold">Панель администратора</h1>
          <Link to="/" className="btn btn-sm btn-outline-secondary">← На сайт</Link>
        </div>
      </header>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <nav className="nav flex-column">
            {navLink('/admin', 'Обзор')}
            {navLink('/admin/users', 'Пользователи')}
            {navLink('/admin/reports', 'Жалобы')}
            {navLink('/admin/business-applications', 'Заявки «Магазин»')}
            {navLink('/admin/banners', 'Баннеры главной')}
            {navLink('/admin/top-banners', 'Реклама в шапке')}
          </nav>
        </aside>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
