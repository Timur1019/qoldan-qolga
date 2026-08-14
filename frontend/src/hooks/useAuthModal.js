import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PARAMS } from '../constants/routes'

/**
 * Возвращает функцию открытия модалки авторизации (логин).
 * Единое место работы с query-параметром auth — без магических строк в страницах.
 */
export function useAuthModal() {
  const [, setSearchParams] = useSearchParams()

  const openAuthModal = useCallback((mode = PARAMS.AUTH_LOGIN) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set(
          PARAMS.AUTH,
          mode === PARAMS.AUTH_REGISTER ? PARAMS.AUTH_REGISTER : PARAMS.AUTH_LOGIN
        )
        return next
      },
      { replace: true }
    )
  }, [setSearchParams])

  return openAuthModal
}
