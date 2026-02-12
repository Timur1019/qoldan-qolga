import { useState, useEffect, useCallback } from 'react'
import { favoritesApi } from '../api/client'
import { useAuth } from '../context/AuthContext'

/**
 * Счётчик объявлений в избранном.
 * Загружается при монтировании и сбрасывается при выходе из аккаунта.
 */
export function useFavoritesCount() {
  const { isAuthenticated } = useAuth()
  const [count, setCount] = useState(0)

  const refresh = useCallback(() => {
    if (!isAuthenticated) {
      setCount(0)
      return
    }
    favoritesApi
      .list({ page: 0, size: 1 })
      .then((data) => {
        const total =
          data?.totalElements ??
          data?.total_elements ??
          (Array.isArray(data) ? data.length : 0)
        setCount(total || 0)
      })
      .catch(() => setCount(0))
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('favorites-count-refresh', handler)
    return () => window.removeEventListener('favorites-count-refresh', handler)
  }, [refresh])

  /* Обновление при возврате на вкладку и при фокусе окна */
  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('focus', handler)
    const visHandler = () => { if (document.visibilityState === 'visible') refresh() }
    document.addEventListener('visibilitychange', visHandler)
    return () => {
      window.removeEventListener('focus', handler)
      document.removeEventListener('visibilitychange', visHandler)
    }
  }, [refresh])

  return count
}

