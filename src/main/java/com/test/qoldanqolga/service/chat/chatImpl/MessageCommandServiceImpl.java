package com.test.qoldanqolga.service.chat.chatImpl;

import com.test.qoldanqolga.dto.chat.MessageDto;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.mapper.ChatMessageMapper;
import com.test.qoldanqolga.model.ChatMessage;
import com.test.qoldanqolga.model.Conversation;
import com.test.qoldanqolga.model.ConversationRead;
import com.test.qoldanqolga.repository.ChatMessageRepository;
import com.test.qoldanqolga.repository.ConversationReadRepository;
import com.test.qoldanqolga.repository.ConversationRepository;
import com.test.qoldanqolga.service.chat.ChatAccessService;
import com.test.qoldanqolga.service.chat.ChatWebSocketService;
import com.test.qoldanqolga.service.chat.MessageCommandService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class MessageCommandServiceImpl implements MessageCommandService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final ConversationReadRepository conversationReadRepository;
    private final ChatMessageMapper chatMessageMapper;
    private final ChatAccessService chatAccessService;
    private final ChatWebSocketService chatWebSocketService;

    @Override
    @Transactional
    public void markAsRead(String conversationId, String userId) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        chatAccessService.ensureParticipant(c, userId);
        Instant now = Instant.now();
        conversationReadRepository.findByConversationIdAndUserId(conversationId, userId)
                .ifPresentOrElse(
                        r -> { r.setLastReadAt(now); conversationReadRepository.save(r); },
                        () -> {
                            ConversationRead r = new ConversationRead();
                            r.setConversationId(conversationId);
                            r.setUserId(userId);
                            r.setLastReadAt(now);
                            conversationReadRepository.save(r);
                        }
                );
    }

    @Override
    @Transactional
    public MessageDto sendMessage(String conversationId, String senderId, String text) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        chatAccessService.ensureParticipant(c, senderId);
        ChatMessage msg = new ChatMessage();
        msg.setConversationId(conversationId);
        msg.setSenderId(senderId);
        msg.setText(text != null ? text.trim() : "");
        msg = messageRepository.save(msg);
        MessageDto dto = chatMessageMapper.toDto(msg);
        chatWebSocketService.sendToConversation(conversationId, dto);
        LogUtil.debug(MessageCommandServiceImpl.class, "Message sent: conversation={} messageId={}", conversationId, dto.getId());
        return dto;
    }

    @Override
    @Transactional
    public MessageDto updateMessage(String conversationId, String messageId, String userId, String newText) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        chatAccessService.ensureParticipant(c, userId);
        ChatMessage msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Сообщение", messageId));
        if (!msg.getConversationId().equals(conversationId)) {
            throw new IllegalArgumentException("Сообщение не принадлежит этому диалогу");
        }
        if (!msg.getSenderId().equals(userId)) {
            throw new IllegalArgumentException("Можно редактировать только свои сообщения");
        }
        msg.setText(newText != null ? newText.trim() : "");
        msg = messageRepository.save(msg);
        MessageDto dto = chatMessageMapper.toDto(msg);
        chatWebSocketService.sendToConversation(conversationId, dto);
        return dto;
    }

    @Override
    @Transactional
    public void deleteMessage(String conversationId, String messageId, String userId) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        chatAccessService.ensureParticipant(c, userId);
        ChatMessage msg = messageRepository.findById(messageId).orElse(null);
        if (msg == null) {
            return;
        }
        if (!msg.getConversationId().equals(conversationId)) {
            throw new IllegalArgumentException("Сообщение не принадлежит этому диалогу");
        }
        if (!msg.getSenderId().equals(userId)) {
            throw new IllegalArgumentException("Можно удалять только свои сообщения");
        }
        messageRepository.delete(msg);
    }
}
