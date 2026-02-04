import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/client'
import styles from './Register.module.css'

export default function Register() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await authApi.register({ email, password, displayName })
      setAuth(res.token, { id: res.userId, email: res.email, displayName: res.displayName })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Ошибка регистрации')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Регистрация</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <label className={styles.label}>
            Имя
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoComplete="name"
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Пароль (не менее 6 символов)
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className={styles.input}
            />
          </label>
          <button type="submit" disabled={submitting} className={styles.submit}>
            {submitting ? 'Регистрация…' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className={styles.footer}>
          Уже есть аккаунт? <Link to="/login">Вход</Link>
        </p>
      </div>
    </div>
  )
}
