package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.chat.ConversationDto;
import com.test.qoldanqolga.dto.chat.MessageDto;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.ChatMessage;
import com.test.qoldanqolga.model.Conversation;
import com.test.qoldanqolga.model.ConversationRead;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.ConversationReadRepository;
import com.test.qoldanqolga.repository.ConversationRepository;
import com.test.qoldanqolga.repository.ChatMessageRepository;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final ConversationReadRepository conversationReadRepository;
    private final AdvertisementRepository advertisementRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private static final String WS_TOPIC_PREFIX = "/topic/chat/";

    @Transactional(readOnly = true)
    public List<ConversationDto> getConversationsForUser(String userId) {
        return conversationRepository.findAllByParticipant(userId).stream()
                .map(c -> toConversationDto(c, userId))
                .collect(Collectors.toList());
    }

    @Transactional
    public ConversationDto getOrCreateConversation(Long adId, String currentUserId) {
        var ad = advertisementRepository.findById(adId)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", adId));
        if (ad.getUserId().equals(currentUserId)) {
            throw new IllegalArgumentException("Нельзя создать чат со своим объявлением");
        }
        return conversationRepository.findByAdIdAndBuyerId(adId, currentUserId)
                .map(c -> toConversationDto(c, currentUserId))
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setAdId(adId);
                    c.setBuyerId(currentUserId);
                    c = conversationRepository.save(c);
                    var seller = userRepository.findById(ad.getUserId()).orElse(null);
                    String sellerName = seller != null ? seller.getDisplayName() : "";
                    String sellerAvatar = seller != null ? seller.getAvatar() : null;
                    return ConversationDto.builder()
                            .id(c.getId())
                            .adId(adId)
                            .adTitle(ad.getTitle())
                            .otherPartyName(sellerName)
                            .otherPartyId(ad.getUserId())
                            .otherPartyAvatar(sellerAvatar)
                            .createdAt(c.getCreatedAt())
                            .messageCount(0)
                            .incomingMessageCount(0)
                            .unreadCount(0)
                            .build();
                });
    }

    @Transactional(readOnly = true)
    public List<MessageDto> getMessages(String conversationId, String userId) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        ensureParticipant(c, userId);
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId).stream()
                .map(this::toMessageDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(String conversationId, String userId) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        ensureParticipant(c, userId);
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

    @Transactional
    public MessageDto sendMessage(String conversationId, String senderId, String text) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        ensureParticipant(c, senderId);
        ChatMessage msg = new ChatMessage();
        msg.setConversationId(conversationId);
        msg.setSenderId(senderId);
        msg.setText(text.trim());
        msg = messageRepository.save(msg);
        MessageDto dto = toMessageDto(msg);
        messagingTemplate.convertAndSend(WS_TOPIC_PREFIX + conversationId, dto);
        return dto;
    }

    @Transactional
    public MessageDto updateMessage(String conversationId, Long messageId, String userId, String newText) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        ensureParticipant(c, userId);
        ChatMessage msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Сообщение", messageId));
        if (!msg.getConversationId().equals(conversationId)) {
            throw new IllegalArgumentException("Сообщение не принадлежит этому диалогу");
        }
        if (!msg.getSenderId().equals(userId)) {
            throw new IllegalArgumentException("Можно редактировать только свои сообщения");
        }
        msg.setText(newText.trim());
        msg = messageRepository.save(msg);
        MessageDto dto = toMessageDto(msg);
        messagingTemplate.convertAndSend(WS_TOPIC_PREFIX + conversationId, dto);
        return dto;
    }

    @Transactional
    public void deleteMessage(String conversationId, Long messageId, String userId) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        ensureParticipant(c, userId);
        ChatMessage msg = messageRepository.findById(messageId).orElse(null);
        if (msg == null) {
            return; // уже удалено — идемпотентный DELETE
        }
        if (!msg.getConversationId().equals(conversationId)) {
            throw new IllegalArgumentException("Сообщение не принадлежит этому диалогу");
        }
        if (!msg.getSenderId().equals(userId)) {
            throw new IllegalArgumentException("Можно удалять только свои сообщения");
        }
        messageRepository.delete(msg);
    }

    @Transactional
    public void deleteConversation(String conversationId, String userId) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        ensureParticipant(c, userId);
        conversationReadRepository.findByConversationId(conversationId).forEach(conversationReadRepository::delete);
        messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId).forEach(messageRepository::delete);
        conversationRepository.delete(c);
    }

    private void ensureParticipant(Conversation c, String userId) {
        boolean isBuyer = c.getBuyerId().equals(userId);
        boolean isSeller = c.getAd() != null && c.getAd().getUserId().equals(userId);
        if (!isBuyer && !isSeller) {
            throw new IllegalArgumentException("Нет доступа к этому диалогу");
        }
    }

    private ConversationDto toConversationDto(Conversation c, String currentUserId) {
        String otherId = c.getBuyerId().equals(currentUserId)
                ? (c.getAd() != null ? c.getAd().getUserId() : null)
                : c.getBuyerId();
        var otherUser = otherId != null ? userRepository.findById(otherId).orElse(null) : null;
        String otherName = otherUser != null ? otherUser.getDisplayName() : "";
        String otherAvatar = otherUser != null ? otherUser.getAvatar() : null;
        String adTitle = c.getAd() != null ? c.getAd().getTitle() : "";
        long messageCount = messageRepository.countByConversationId(c.getId());
        long incomingMessageCount = messageRepository.countByConversationIdAndSenderIdNot(c.getId(), currentUserId);
        Instant lastReadAt = conversationReadRepository.findByConversationIdAndUserId(c.getId(), currentUserId)
                .map(ConversationRead::getLastReadAt)
                .orElse(null);
        long unreadCount = lastReadAt == null
                ? messageRepository.countByConversationIdAndSenderIdNot(c.getId(), currentUserId)
                : messageRepository.countUnreadSince(c.getId(), currentUserId, lastReadAt);
        return ConversationDto.builder()
                .id(c.getId())
                .adId(c.getAdId())
                .adTitle(adTitle)
                .otherPartyName(otherName)
                .otherPartyId(otherId)
                .otherPartyAvatar(otherAvatar)
                .createdAt(c.getCreatedAt())
                .messageCount(messageCount)
                .incomingMessageCount(incomingMessageCount)
                .unreadCount(unreadCount)
                .build();
    }

    private MessageDto toMessageDto(ChatMessage m) {
        var sender = userRepository.findById(m.getSenderId()).orElse(null);
        String senderName = sender != null ? sender.getDisplayName() : "";
        String senderAvatar = sender != null ? sender.getAvatar() : null;
        return MessageDto.builder()
                .id(m.getId())
                .conversationId(m.getConversationId())
                .senderId(m.getSenderId())
                .senderName(senderName)
                .senderAvatar(senderAvatar)
                .text(m.getText())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
