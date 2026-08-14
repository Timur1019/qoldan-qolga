import { Client, type IMessage } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';

import { getWsBaseUrl } from '@/api/client';

/**
 * Порт frontend/src/hooks/useStompChat.js. Веб использует sockjs-client — оно завязано на
 * DOM/XHR и не работает в React Native. Backend регистрирует STOMP endpoint с .withSockJS(),
 * что даёт доступ к "сырому" WebSocket-транспорту SockJS по пути /ws/websocket — на него и
 * подключаемся напрямую нативным WebSocket (глобально доступен в RN), без SockJS-обёртки.
 */
export function useStompChat(conversationId: string | null | undefined, onMessage: ((msg: unknown) => void) | undefined) {
  const clientRef = useRef<Client | null>(null);
  const onMessageRef = useRef(onMessage);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!conversationId) {
      setConnected(false);
      return;
    }

    setConnected(false);
    const client = new Client({
      brokerURL: getWsBaseUrl(),
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/chat/${conversationId}`, (frame: IMessage) => {
          try {
            onMessageRef.current?.(JSON.parse(frame.body));
          } catch {
            // ignore parse error
          }
        });
      },
      onStompError: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
    });
    clientRef.current = client;
    client.activate();

    return () => {
      setConnected(false);
      client.deactivate();
      clientRef.current = null;
    };
  }, [conversationId]);

  return { connected };
}
