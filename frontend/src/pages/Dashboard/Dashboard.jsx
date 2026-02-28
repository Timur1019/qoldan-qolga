import { useAuth } from '../../context/AuthContext'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="page-container app-page">
      <div className={`${styles.dashboardCard} app-card`}>
        <h1 className={styles.title}>Личный кабинет</h1>
        <p className={styles.greeting}>
          Здравствуйте, {user?.displayName ?? user?.email}.
        </p>
        <p className={styles.hint}>
          Здесь можно расширять функционал для авторизованных пользователей.
        </p>
      </div>
    </div>
  )
}
