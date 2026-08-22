package com.test.qoldanqolga.service.chat.chatImpl;

import com.test.qoldanqolga.dto.chat.MessageDto;
import com.test.qoldanqolga.dto.chat.SendMessageRequest;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.mapper.ChatMessageMapper;
import com.test.qoldanqolga.model.ChatMessage;
import com.test.qoldanqolga.model.Conversation;
import com.test.qoldanqolga.model.ConversationRead;
import com.test.qoldanqolga.repository.ChatMessageRepository;
import com.test.qoldanqolga.repository.ConversationReadRepository;
import com.test.qoldanqolga.repository.ConversationRepository;
import com.test.qoldanqolga.config.SystemConversationProperties;
import com.test.qoldanqolga.service.chat.ChatAccessService;
import com.test.qoldanqolga.service.chat.ChatWebSocketService;
import com.test.qoldanqolga.service.chat.MessageCommandService;
import com.test.qoldanqolga.dto.notification.NotificationEvent;
import com.test.qoldanqolga.notification.NotificationEntityType;
import com.test.qoldanqolga.notification.NotificationType;
import com.test.qoldanqolga.service.notification.NotificationService;
import com.test.qoldanqolga.util.AfterCommit;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MessageCommandServiceImpl implements MessageCommandService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final ConversationReadRepository conversationReadRepository;
    private final ChatMessageMapper chatMessageMapper;
    private final ChatAccessService chatAccessService;
    private final ChatWebSocketService chatWebSocketService;
    private final NotificationService notificationService;
    private final SystemConversationProperties systemConversationProperties;

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
        chatWebSocketService.sendReadEvent(conversationId, userId, now);
        LogUtil.debug(MessageCommandServiceImpl.class, "Conversation marked as read: conversationId={} userId={}", conversationId, userId);
    }

    @Override
    @Transactional
    public MessageDto sendMessage(String conversationId, String senderId, SendMessageRequest request) {
        Conversation c = conversationRepository.findByIdWithAd(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        chatAccessService.ensureParticipant(c, senderId);
        String text = request.getText() != null ? request.getText().trim() : "";
        String attachmentUrl = request.getAttachmentUrl() != null ? request.getAttachmentUrl().trim() : null;
        String messageType = request.getMessageType() != null && !request.getMessageType().isBlank()
                ? request.getMessageType().trim().toUpperCase()
                : (attachmentUrl != null && !attachmentUrl.isBlank() ? "IMAGE" : "TEXT");

        ChatMessage msg = new ChatMessage();
        msg.setConversationId(conversationId);
        msg.setSenderId(senderId);
        msg.setText(text);
        msg.setAttachmentUrl(attachmentUrl);
        msg.setMessageType(messageType);
        msg = messageRepository.save(msg);
        MessageDto dto = chatMessageMapper.toDto(msg);
        dto.setStatus("DELIVERED");
        chatWebSocketService.sendMessageEvent(conversationId, dto);
        String recipientId = resolveRecipientUserId(c, senderId);
        String preview = dto.getText() != null && !dto.getText().isBlank()
                ? dto.getText()
                : ("IMAGE".equals(dto.getMessageType()) ? "Фото" : "Вложение");
        boolean systemSender = senderId != null && senderId.equals(systemConversationProperties.getUserId());
        String systemUserId = systemConversationProperties.getUserId();
        if (recipientId != null && !recipientId.equals(senderId) && !recipientId.equals(systemUserId)) {
            NotificationType type = resolveMessageType(systemSender, dto.getMessageType());
            String title = systemSender
                    ? "Уведомление"
                    : (dto.getSenderName() != null && !dto.getSenderName().isBlank() ? dto.getSenderName().trim() : "Сообщение");
            AfterCommit.run(() -> notificationService.publish(NotificationEvent.builder()
                    .type(type)
                    .recipientUserId(recipientId)
                    .title(title)
                    .body(preview)
                    .entityType(NotificationEntityType.CHAT)
                    .entityId(conversationId)
                    .payload(Map.of(
                            "chatId", conversationId,
                            "senderName", dto.getSenderName() != null ? dto.getSenderName() : ""
                    ))
                    .build()));
        }
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
        chatWebSocketService.sendMessageEvent(conversationId, dto);
        LogUtil.debug(MessageCommandServiceImpl.class, "Message updated: conversation={} messageId={}", conversationId, messageId);
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
        LogUtil.debug(MessageCommandServiceImpl.class, "Message deleted: conversation={} messageId={}", conversationId, messageId);
    }

    private static NotificationType resolveMessageType(boolean systemSender, String messageType) {
        if (systemSender) {
            return NotificationType.SYSTEM_MESSAGE;
        }
        if ("IMAGE".equalsIgnoreCase(messageType)) {
            return NotificationType.PHOTO_MESSAGE;
        }
        if ("VOICE".equalsIgnoreCase(messageType)) {
            return NotificationType.VOICE_MESSAGE;
        }
        return NotificationType.NEW_MESSAGE;
    }

    private static String resolveRecipientUserId(Conversation c, String senderId) {
        String sellerId = c.getAd() != null ? c.getAd().getUserId() : null;
        if (senderId != null && senderId.equals(c.getBuyerId())) {
            return sellerId;
        }
        return c.getBuyerId();
    }
}
