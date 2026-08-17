import { useState } from 'react'
import { authApi } from '@/api/auth'
import { formatApiError } from '../../../../utils/apiError'

/**
 * Логин админа по email/паролю.
 */
export function useAdminLogin({ setAuth, refreshUser, onSuccess, t }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e?.preventDefault?.()
    setError('')
    const emailVal = email.trim().toLowerCase()
    if (!emailVal || !password) {
      setError(t('auth.fillAll') || 'Введите email и пароль')
      return
    }
    setSubmitting(true)
    try {
      const res = await authApi.login({ email: emailVal, password })
      if ((res.role || 'USER') !== 'ADMIN') {
        setError('Этот аккаунт не является администратором')
        return
      }
      setAuth(
        res.token,
        {
          id: res.userId,
          email: res.email,
          phone: res.phone,
          displayName: res.displayName,
          role: res.role || 'USER',
          avatar: res.avatar,
        },
        true,
      )
      await refreshUser()
      onSuccess?.()
    } catch (err) {
      setError(formatApiError(err, t) || t('errors.INVALID_CREDENTIALS') || 'Неверный email или пароль')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    submitting,
    submit,
  }
}
