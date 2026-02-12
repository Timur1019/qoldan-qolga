package com.test.qoldanqolga.service.chat;

import com.test.qoldanqolga.model.ConversationRead;
import com.test.qoldanqolga.repository.ChatMessageRepository;
import com.test.qoldanqolga.repository.ConversationReadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Пакетный подсчёт статистики по диалогам (устраняет N+1).
 */
@Service
@RequiredArgsConstructor
public class ConversationStatisticsService {

    private final ChatMessageRepository messageRepository;
    private final ConversationReadRepository conversationReadRepository;

    public Map<String, ConversationStatistics> getStatisticsBatch(List<String> conversationIds, String currentUserId) {
        if (conversationIds == null || conversationIds.isEmpty()) {
            return Map.of();
        }

        Map<String, Long> totalCounts = toMap(messageRepository.countByConversationIdIn(conversationIds));
        Map<String, Long> incomingCounts = toMap(messageRepository.countByConversationIdInAndSenderIdNot(conversationIds, currentUserId));
        Map<String, Long> unreadCounts = toMap(messageRepository.countUnreadBatch(conversationIds, currentUserId));
        Map<String, java.time.Instant> lastReadAt = new HashMap<>();
        conversationReadRepository.findByConversationIdInAndUserId(conversationIds, currentUserId)
                .forEach(r -> lastReadAt.put(r.getConversationId(), r.getLastReadAt()));

        Map<String, ConversationStatistics> result = new HashMap<>();
        for (String id : conversationIds) {
            long total = totalCounts.getOrDefault(id, 0L);
            long incoming = incomingCounts.getOrDefault(id, 0L);
            long unread = lastReadAt.containsKey(id)
                    ? unreadCounts.getOrDefault(id, 0L)
                    : incoming;
            result.put(id, ConversationStatistics.builder()
                    .messageCount(total)
                    .incomingMessageCount(incoming)
                    .unreadCount(unread)
                    .lastReadAt(lastReadAt.get(id))
                    .build());
        }
        return result;
    }

    private static Map<String, Long> toMap(List<Object[]> rows) {
        Map<String, Long> map = new HashMap<>();
        for (Object[] row : rows) {
            map.put((String) row[0], ((Number) row[1]).longValue());
        }
        return map;
    }
}
