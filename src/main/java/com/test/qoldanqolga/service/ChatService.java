package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.chat.ConversationDto;
import com.test.qoldanqolga.dto.chat.MessageDto;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.ChatMessage;
import com.test.qoldanqolga.model.Conversation;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.ConversationRepository;
import com.test.qoldanqolga.repository.ChatMessageRepository;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
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
                    String sellerName = userRepository.findById(ad.getUserId()).map(User::getDisplayName).orElse("");
                    return ConversationDto.builder()
                            .id(c.getId())
                            .adId(adId)
                            .adTitle(ad.getTitle())
                            .otherPartyName(sellerName)
                            .otherPartyId(ad.getUserId())
                            .createdAt(c.getCreatedAt())
                            .messageCount(0)
                            .incomingMessageCount(0)
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
        String otherName = otherId != null ? userRepository.findById(otherId).map(User::getDisplayName).orElse("") : "";
        String adTitle = c.getAd() != null ? c.getAd().getTitle() : "";
        long messageCount = messageRepository.countByConversationId(c.getId());
        long incomingMessageCount = messageRepository.countByConversationIdAndSenderIdNot(c.getId(), currentUserId);
        return ConversationDto.builder()
                .id(c.getId())
                .adId(c.getAdId())
                .adTitle(adTitle)
                .otherPartyName(otherName)
                .otherPartyId(otherId)
                .createdAt(c.getCreatedAt())
                .messageCount(messageCount)
                .incomingMessageCount(incomingMessageCount)
                .build();
    }

    private MessageDto toMessageDto(ChatMessage m) {
        String senderName = userRepository.findById(m.getSenderId())
                .map(u -> u.getDisplayName())
                .orElse("");
        return MessageDto.builder()
                .id(m.getId())
                .conversationId(m.getConversationId())
                .senderId(m.getSenderId())
                .senderName(senderName)
                .text(m.getText())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
