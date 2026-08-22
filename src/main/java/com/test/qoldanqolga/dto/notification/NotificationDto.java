package com.test.qoldanqolga.dto.notification;

import com.test.qoldanqolga.notification.NotificationCategory;
import com.test.qoldanqolga.notification.NotificationEntityType;
import com.test.qoldanqolga.notification.NotificationType;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
public class NotificationDto {

    private String id;
    private NotificationType type;
    private NotificationCategory category;
    private String title;
    private String body;
    private NotificationEntityType entityType;
    private String entityId;
    private Map<String, String> payload;
    private Integer groupCount;
    private Boolean isRead;
    private Instant readAt;
    private Instant createdAt;
}
