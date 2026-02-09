import { useState, useEffect, useCallback } from 'react'
import { chatApi } from '../api/client'
import { useAuth } from '../context/AuthContext'

/**
 * Счётчик непрочитанных сообщений в чатах.
 * Обновляется при загрузке и по событию 'chat-count-refresh' (страница чата шлёт при изменении).
 */
export function useChatUnreadCount() {
  const { isAuthenticated } = useAuth()
  const [count, setCount] = useState(0)

  const refresh = useCallback(() => {
    if (!isAuthenticated) {
      setCount(0)
      return
    }
    chatApi
      .getConversations()
      .then((list) => {
        const total = (list || []).reduce(
          (sum, c) => sum + (c.unreadCount ?? c.unread_count ?? 0),
          0
        )
        setCount(total)
      })
      .catch(() => setCount(0))
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('chat-count-refresh', handler)
    return () => window.removeEventListener('chat-count-refresh', handler)
  }, [refresh])

  return count
}
