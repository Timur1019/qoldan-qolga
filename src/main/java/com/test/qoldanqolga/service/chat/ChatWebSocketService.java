package com.test.qoldanqolga.service.chat;

import com.test.qoldanqolga.dto.chat.MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Отправка сообщений через WebSocket.
 */
@Service
@RequiredArgsConstructor
public class ChatWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    @Value("${websocket.topic.chat.prefix:/topic/chat/}")
    private String wsTopicPrefix;

    public void sendToConversation(String conversationId, MessageDto message) {
        messagingTemplate.convertAndSend(wsTopicPrefix + conversationId, message);
    }
}
