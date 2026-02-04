import { useState, useEffect } from 'react'
import { adminApi } from '../../api/client'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi
      .dashboard()
      .then(setData)
      .catch((e) => setError(e.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Загрузка…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Панель администратора</h1>
      <p className={styles.message}>{data?.message ?? 'Добро пожаловать в админ-панель.'}</p>
    </div>
  )
}
