import { useAuth } from '../../context/AuthContext'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Личный кабинет</h1>
      <p className={styles.greeting}>
        Здравствуйте, {user?.displayName ?? user?.email}.
      </p>
      <p className={styles.hint}>
        Здесь можно расширять функционал для авторизованных пользователей.
      </p>
    </div>
  )
}
