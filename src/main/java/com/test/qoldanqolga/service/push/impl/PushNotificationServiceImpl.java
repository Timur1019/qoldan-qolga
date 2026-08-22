package com.test.qoldanqolga.service.push.impl;

import com.test.qoldanqolga.dto.notification.NotificationEvent;
import com.test.qoldanqolga.notification.NotificationEntityType;
import com.test.qoldanqolga.notification.NotificationType;
import com.test.qoldanqolga.service.notification.NotificationService;
import com.test.qoldanqolga.service.push.PushNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * @deprecated Use {@link NotificationService#publish(NotificationEvent)} directly.
 */
@Deprecated
@Service
@RequiredArgsConstructor
public class PushNotificationServiceImpl implements PushNotificationService {

    private final NotificationService notificationService;

    @Override
    public void notifyChatMessage(String recipientUserId, String conversationId, String preview, String senderName) {
        notificationService.publish(NotificationEvent.builder()
                .type(NotificationType.NEW_MESSAGE)
                .recipientUserId(recipientUserId)
                .title(senderName != null && !senderName.isBlank() ? senderName.trim() : "Сообщение")
                .body(preview)
                .entityType(NotificationEntityType.CHAT)
                .entityId(conversationId)
                .payload(Map.of("chatId", conversationId, "senderName", senderName != null ? senderName : ""))
                .build());
    }

    @Override
    public void notifySystem(String recipientUserId, String conversationId, String title, String body) {
        notificationService.publish(NotificationEvent.builder()
                .type(NotificationType.SYSTEM_MESSAGE)
                .recipientUserId(recipientUserId)
                .title(title)
                .body(body)
                .entityType(NotificationEntityType.CHAT)
                .entityId(conversationId)
                .payload(Map.of("chatId", conversationId))
                .build());
    }

    @Override
    public void notifyPromo(String recipientUserId, String adId, String title, String body) {
        notificationService.publish(NotificationEvent.builder()
                .type(NotificationType.PROMOTION_ACTIVE)
                .recipientUserId(recipientUserId)
                .title(title)
                .body(body)
                .entityType(NotificationEntityType.AD)
                .entityId(adId)
                .build());
    }
}
