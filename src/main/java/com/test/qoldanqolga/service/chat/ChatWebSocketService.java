package com.test.qoldanqolga.service.chat;

import com.test.qoldanqolga.dto.chat.ChatWsEventDto;
import com.test.qoldanqolga.dto.chat.MessageDto;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * Отправка сообщений через WebSocket.
 */
@Service
@RequiredArgsConstructor
public class ChatWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    @Value("${websocket.topic.chat.prefix:/topic/chat/}")
    private String wsTopicPrefix;

    public void sendMessageEvent(String conversationId, MessageDto message) {
        ChatWsEventDto event = ChatWsEventDto.builder()
                .type("MESSAGE")
                .message(message)
                .build();
        messagingTemplate.convertAndSend(wsTopicPrefix + conversationId, event);
        LogUtil.debug(ChatWebSocketService.class, "Message sent via WS: conversationId={} messageId={}",
                conversationId, message != null ? message.getId() : null);
    }

    public void sendReadEvent(String conversationId, String readerId, Instant readAt) {
        ChatWsEventDto event = ChatWsEventDto.builder()
                .type("READ")
                .readerId(readerId)
                .readAt(readAt)
                .build();
        messagingTemplate.convertAndSend(wsTopicPrefix + conversationId, event);
        LogUtil.debug(ChatWebSocketService.class, "Read event sent via WS: conversationId={} readerId={}",
                conversationId, readerId);
    }
}
