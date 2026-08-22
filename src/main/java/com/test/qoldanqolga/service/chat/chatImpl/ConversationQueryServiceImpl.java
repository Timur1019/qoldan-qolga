package com.test.qoldanqolga.service.chat.chatImpl;

import com.test.qoldanqolga.dto.chat.ConversationDto;
import com.test.qoldanqolga.dto.chat.MessageDto;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.mapper.ChatMessageMapper;
import com.test.qoldanqolga.mapper.ConversationMapper;
import com.test.qoldanqolga.model.Conversation;
import com.test.qoldanqolga.model.ConversationRead;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.ChatMessageRepository;
import com.test.qoldanqolga.repository.ConversationReadRepository;
import com.test.qoldanqolga.repository.ConversationRepository;
import com.test.qoldanqolga.service.chat.ChatAccessService;
import com.test.qoldanqolga.service.chat.ConversationDtoEnricher;
import com.test.qoldanqolga.service.chat.ConversationQueryService;
import com.test.qoldanqolga.service.chat.ConversationStatistics;
import com.test.qoldanqolga.service.chat.ConversationStatisticsService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationQueryServiceImpl implements ConversationQueryService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final ConversationReadRepository conversationReadRepository;
    private final ConversationMapper conversationMapper;
    private final ChatMessageMapper chatMessageMapper;
    private final ChatAccessService chatAccessService;
    private final ConversationStatisticsService statisticsService;
    private final ConversationDtoEnricher conversationDtoEnricher;

    @Override
    @Transactional(readOnly = true)
    public List<ConversationDto> getConversationsForUser(String userId) {
        List<Conversation> conversations = conversationRepository.findAllByParticipant(userId);
        LogUtil.debug(ConversationQueryServiceImpl.class, "Conversations loaded: userId={} count={}", userId, conversations.size());
        if (conversations.isEmpty()) {
            return List.of();
        }
        List<String> ids = conversations.stream().map(Conversation::getId).collect(Collectors.toList());
        var stats = statisticsService.getStatisticsBatch(ids, userId);
        Map<String, ConversationDtoEnricher.LastMessagePreview> lastMessages = loadLastMessages(ids);

        List<ConversationDto> result = conversations.stream().map(c -> {
            String otherPartyId = c.getBuyerId().equals(userId)
                    ? (c.getAd() != null ? c.getAd().getUserId() : null)
                    : c.getBuyerId();
            User otherUser = c.getBuyerId().equals(userId) && c.getAd() != null ? c.getAd().getUser() : c.getBuyer();
            ConversationStatistics stat = stats.getOrDefault(c.getId(),
                    ConversationStatistics.builder().messageCount(0).incomingMessageCount(0).unreadCount(0).build());
            ConversationDto dto = conversationMapper.toDto(c, otherPartyId, otherUser, stat);
            conversationDtoEnricher.enrich(dto, c.getAd(), otherUser, lastMessages.get(c.getId()));
            return dto;
        }).sorted(Comparator
                .comparing((ConversationDto d) -> d.getLastMessageAt() != null ? d.getLastMessageAt() : d.getCreatedAt())
                .reversed())
                .collect(Collectors.toList());
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDto> getMessages(String conversationId, String userId) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        chatAccessService.ensureParticipant(c, userId);
        String otherPartyId = resolveOtherPartyId(c, userId);
        Instant otherLastReadAt = conversationReadRepository.findByConversationIdAndUserId(conversationId, otherPartyId)
                .map(ConversationRead::getLastReadAt)
                .orElse(null);

        List<MessageDto> messages = messageRepository.findByConversationIdWithSender(conversationId).stream()
                .map(msg -> {
                    MessageDto dto = chatMessageMapper.toDto(msg);
                    dto.setStatus(conversationDtoEnricher.resolveMessageStatus(
                            msg.getSenderId(), userId, msg.getCreatedAt(), otherLastReadAt));
                    return dto;
                })
                .collect(Collectors.toList());
        LogUtil.debug(ConversationQueryServiceImpl.class, "Messages loaded: conversationId={} count={}", conversationId, messages.size());
        return messages;
    }

    private Map<String, ConversationDtoEnricher.LastMessagePreview> loadLastMessages(List<String> conversationIds) {
        Map<String, ConversationDtoEnricher.LastMessagePreview> map = new HashMap<>();
        for (Object[] row : messageRepository.findLastMessagesByConversationIds(conversationIds)) {
            String conversationId = (String) row[0];
            String text = row[1] != null ? row[1].toString() : "";
            Instant createdAt = toInstant(row[2]);
            String messageType = row.length > 3 && row[3] != null ? row[3].toString() : "TEXT";
            String attachmentUrl = row.length > 4 && row[4] != null ? row[4].toString() : null;
            String preview = conversationDtoEnricher.previewForMessage(text, messageType, attachmentUrl);
            map.put(conversationId, new ConversationDtoEnricher.LastMessagePreview(preview, createdAt));
        }
        return map;
    }

    private static String resolveOtherPartyId(Conversation c, String userId) {
        if (c.getBuyerId().equals(userId)) {
            return c.getAd() != null ? c.getAd().getUserId() : c.getBuyerId();
        }
        return c.getBuyerId();
    }

    private static Instant toInstant(Object value) {
        if (value == null) return null;
        if (value instanceof Instant instant) return instant;
        if (value instanceof Timestamp ts) return ts.toInstant();
        return Instant.parse(value.toString());
    }
}
