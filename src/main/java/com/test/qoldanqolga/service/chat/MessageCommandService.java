package com.test.qoldanqolga.service.chat;

import com.test.qoldanqolga.dto.chat.MessageDto;

/**
 * Отправка, редактирование и удаление сообщений.
 */
public interface MessageCommandService {

    void markAsRead(String conversationId, String userId);

    MessageDto sendMessage(String conversationId, String senderId, String text);

    MessageDto updateMessage(String conversationId, String messageId, String userId, String newText);

    void deleteMessage(String conversationId, String messageId, String userId);
}
