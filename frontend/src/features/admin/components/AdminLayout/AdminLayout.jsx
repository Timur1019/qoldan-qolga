import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LangContext'
import AdminHeader from '../AdminHeader/AdminHeader'
import AdminSidebar from '../AdminSidebar/AdminSidebar'
import styles from './AdminLayout.module.css'

export default function AdminLayout() {
  const { t, lang, setLang } = useLang()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className={styles.shell}>
      <AdminSidebar t={t} onLogout={handleLogout} />
      <div className={styles.body}>
        <AdminHeader t={t} lang={lang} onLangChange={setLang} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
