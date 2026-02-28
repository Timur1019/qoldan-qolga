package com.test.qoldanqolga.service.chat;

import com.test.qoldanqolga.dto.chat.ConversationDto;

/**
 * Создание и удаление диалогов.
 */
public interface ConversationCommandService {

    ConversationDto getOrCreateConversation(String adId, String currentUserId);

    /**
     * Возвращает или создаёт системный диалог с пользователем (для уведомлений).
     * @return id диалога
     */
    String getOrCreateSystemConversation(String userId);

    void deleteConversation(String conversationId, String userId);
}
