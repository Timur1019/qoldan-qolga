package com.test.qoldanqolga.service.chat;

import com.test.qoldanqolga.dto.chat.ConversationDto;

/**
 * Создание и удаление диалогов.
 */
public interface ConversationCommandService {

    ConversationDto getOrCreateConversation(String adId, String currentUserId);

    void deleteConversation(String conversationId, String userId);
}
