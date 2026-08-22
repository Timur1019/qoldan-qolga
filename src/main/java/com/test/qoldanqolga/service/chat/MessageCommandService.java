package com.test.qoldanqolga.service.chat;

import com.test.qoldanqolga.dto.chat.MessageDto;
import com.test.qoldanqolga.dto.chat.SendMessageRequest;

/**
 * Отправка, редактирование и удаление сообщений.
 */
public interface MessageCommandService {

    void markAsRead(String conversationId, String userId);

    MessageDto sendMessage(String conversationId, String senderId, SendMessageRequest request);

    MessageDto updateMessage(String conversationId, String messageId, String userId, String newText);

    void deleteMessage(String conversationId, String messageId, String userId);
}
