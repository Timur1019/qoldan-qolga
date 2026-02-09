import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getWsBaseUrl } from '../api/client'

/**
 * Подписка на новые сообщения в диалоге по WebSocket.
 * @param {string | null} conversationId — id диалога (null = не подключаться)
 * @param {(message: object) => void} onMessage — callback при новом сообщении (MessageDto)
 * @returns {{ connected: boolean }} — статус подключения
 */
export function useStompChat(conversationId, onMessage) {
  const clientRef = useRef(null)
  const subscriptionRef = useRef(null)
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    if (!conversationId || typeof onMessage !== 'function') return

    const wsUrl = getWsBaseUrl()
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        const sub = client.subscribe(`/topic/chat/${conversationId}`, (frame) => {
          try {
            const body = JSON.parse(frame.body)
            onMessageRef.current?.(body)
          } catch (_) {}
        })
        subscriptionRef.current = sub
      },
      onStompError: () => {},
    })
    clientRef.current = client
    client.activate()

    return () => {
      subscriptionRef.current?.unsubscribe?.()
      subscriptionRef.current = null
      client.deactivate?.()
      clientRef.current = null
    }
  }, [conversationId])

  return { connected: !!clientRef.current?.connected }
}
