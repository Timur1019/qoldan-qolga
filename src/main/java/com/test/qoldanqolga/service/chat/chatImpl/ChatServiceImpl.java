package com.test.qoldanqolga.service.chat.chatImpl;

import com.test.qoldanqolga.dto.chat.ConversationDto;
import com.test.qoldanqolga.dto.chat.MessageDto;
import com.test.qoldanqolga.service.chat.ChatService;
import com.test.qoldanqolga.service.chat.ConversationCommandService;
import com.test.qoldanqolga.service.chat.ConversationQueryService;
import com.test.qoldanqolga.service.chat.MessageCommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Оркестратор чата: делегирует в Query и Command сервисы.
 */
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ConversationQueryService conversationQueryService;
    private final ConversationCommandService conversationCommandService;
    private final MessageCommandService messageCommandService;

    @Override
    public List<ConversationDto> getConversationsForUser(String userId) {
        return conversationQueryService.getConversationsForUser(userId);
    }

    @Override
    public ConversationDto getOrCreateConversation(String adId, String currentUserId) {
        return conversationCommandService.getOrCreateConversation(adId, currentUserId);
    }

    @Override
    public List<MessageDto> getMessages(String conversationId, String userId) {
        return conversationQueryService.getMessages(conversationId, userId);
    }

    @Override
    public void markAsRead(String conversationId, String userId) {
        messageCommandService.markAsRead(conversationId, userId);
    }

    @Override
    public MessageDto sendMessage(String conversationId, String senderId, String text) {
        return messageCommandService.sendMessage(conversationId, senderId, text);
    }

    @Override
    public MessageDto updateMessage(String conversationId, String messageId, String userId, String newText) {
        return messageCommandService.updateMessage(conversationId, messageId, userId, newText);
    }

    @Override
    public void deleteMessage(String conversationId, String messageId, String userId) {
        messageCommandService.deleteMessage(conversationId, messageId, userId);
    }

    @Override
    public void deleteConversation(String conversationId, String userId) {
        conversationCommandService.deleteConversation(conversationId, userId);
    }
}
