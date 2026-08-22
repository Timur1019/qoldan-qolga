package com.test.qoldanqolga.dto.notification;

import com.test.qoldanqolga.notification.NotificationEntityType;
import com.test.qoldanqolga.notification.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
@AllArgsConstructor
public class NotificationEvent {

    private final NotificationType type;
    private final String recipientUserId;
    private final String title;
    private final String body;
    private final NotificationEntityType entityType;
    private final String entityId;
    private final Map<String, String> payload;
}
