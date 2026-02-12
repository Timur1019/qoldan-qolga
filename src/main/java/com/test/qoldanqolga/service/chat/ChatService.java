package com.test.qoldanqolga.service.chat;

import com.test.qoldanqolga.dto.chat.ConversationDto;
import com.test.qoldanqolga.dto.chat.MessageDto;

import java.util.List;

/**
 * API чата (оркестрация).
 */
public interface ChatService {

    List<ConversationDto> getConversationsForUser(String userId);

    ConversationDto getOrCreateConversation(String adId, String currentUserId);

    List<MessageDto> getMessages(String conversationId, String userId);

    void markAsRead(String conversationId, String userId);

    MessageDto sendMessage(String conversationId, String senderId, String text);

    MessageDto updateMessage(String conversationId, String messageId, String userId, String newText);

    void deleteMessage(String conversationId, String messageId, String userId);

    void deleteConversation(String conversationId, String userId);
}
