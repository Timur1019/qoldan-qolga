package com.test.qoldanqolga.service.notification.impl;

import com.test.qoldanqolga.dto.notification.NotificationEvent;
import com.test.qoldanqolga.model.Notification;
import com.test.qoldanqolga.notification.NotificationEntityType;
import com.test.qoldanqolga.repository.NotificationRepository;
import com.test.qoldanqolga.service.notification.ChatNotificationGrouper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
public class ChatNotificationGrouperImpl implements ChatNotificationGrouper {

    private static final int GROUP_WINDOW_MINUTES = 5;

    private final NotificationRepository notificationRepository;

    @Override
    public Notification findGroupable(NotificationEvent event) {
        if (!event.getType().isGroupable()) {
            return null;
        }
        String groupKey = buildGroupKey(event);
        Instant after = Instant.now().minus(GROUP_WINDOW_MINUTES, ChronoUnit.MINUTES);
        return notificationRepository
                .findFirstByUserIdAndGroupKeyAndIsReadFalseAndDeletedAtIsNullAndCreatedAtAfterOrderByCreatedAtDesc(
                        event.getRecipientUserId(),
                        groupKey,
                        after
                )
                .orElse(null);
    }

    @Override
    public String buildGroupKey(NotificationEvent event) {
        String chatId = resolveChatId(event);
        return "chat:" + chatId;
    }

    @Override
    public String buildGroupedBody(int count) {
        if (count <= 1) {
            return "Новое сообщение";
        }
        return count + " новых сообщения";
    }

    private static String resolveChatId(NotificationEvent event) {
        if (event.getEntityType() == NotificationEntityType.CHAT && event.getEntityId() != null) {
            return event.getEntityId();
        }
        if (event.getPayload() != null && event.getPayload().get("chatId") != null) {
            return event.getPayload().get("chatId");
        }
        return "unknown";
    }
}
