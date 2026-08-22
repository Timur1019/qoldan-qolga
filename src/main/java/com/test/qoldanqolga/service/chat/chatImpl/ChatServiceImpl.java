package com.test.qoldanqolga.service.chat.chatImpl;

import com.test.qoldanqolga.dto.chat.ConversationDto;
import com.test.qoldanqolga.dto.chat.MessageDto;
import com.test.qoldanqolga.dto.chat.SendMessageRequest;
import com.test.qoldanqolga.service.chat.ChatService;
import com.test.qoldanqolga.service.chat.ConversationCommandService;
import com.test.qoldanqolga.service.chat.ConversationQueryService;
import com.test.qoldanqolga.service.chat.MessageCommandService;
import com.test.qoldanqolga.util.LogUtil;
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
        LogUtil.debug(ChatServiceImpl.class, "Get conversations: userId={}", userId);
        return conversationQueryService.getConversationsForUser(userId);
    }

    @Override
    public ConversationDto getOrCreateConversation(String adId, String currentUserId) {
        LogUtil.debug(ChatServiceImpl.class, "Get or create conversation: adId={} userId={}", adId, currentUserId);
        return conversationCommandService.getOrCreateConversation(adId, currentUserId);
    }

    @Override
    public List<MessageDto> getMessages(String conversationId, String userId) {
        LogUtil.debug(ChatServiceImpl.class, "Get messages: conversationId={} userId={}", conversationId, userId);
        return conversationQueryService.getMessages(conversationId, userId);
    }

    @Override
    public void markAsRead(String conversationId, String userId) {
        LogUtil.debug(ChatServiceImpl.class, "Mark as read: conversationId={} userId={}", conversationId, userId);
        messageCommandService.markAsRead(conversationId, userId);
    }

    @Override
    public MessageDto sendMessage(String conversationId, String senderId, SendMessageRequest request) {
        LogUtil.debug(ChatServiceImpl.class, "Send message: conversationId={} senderId={}", conversationId, senderId);
        return messageCommandService.sendMessage(conversationId, senderId, request);
    }

    @Override
    public MessageDto updateMessage(String conversationId, String messageId, String userId, String newText) {
        LogUtil.debug(ChatServiceImpl.class, "Update message: conversationId={} messageId={}", conversationId, messageId);
        return messageCommandService.updateMessage(conversationId, messageId, userId, newText);
    }

    @Override
    public void deleteMessage(String conversationId, String messageId, String userId) {
        LogUtil.debug(ChatServiceImpl.class, "Delete message: conversationId={} messageId={}", conversationId, messageId);
        messageCommandService.deleteMessage(conversationId, messageId, userId);
    }

    @Override
    public void deleteConversation(String conversationId, String userId) {
        LogUtil.debug(ChatServiceImpl.class, "Delete conversation: conversationId={} userId={}", conversationId, userId);
        conversationCommandService.deleteConversation(conversationId, userId);
    }
}
