import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Layout.module.css'

export default function Layout() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Qoldan Qolga
        </Link>
        <nav className={styles.nav}>
          <Link to="/">Главная</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Кабинет</Link>
              {isAdmin && <Link to="/admin">Админ</Link>}
              <span className={styles.userName}>{user?.displayName ?? user?.email}</span>
              <button type="button" onClick={logout} className={styles.logoutBtn}>
                Выход
              </button>
            </>
          ) : (
            <Link to="/login">Вход</Link>
          )}
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
