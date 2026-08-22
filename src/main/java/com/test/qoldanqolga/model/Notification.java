package com.test.qoldanqolga.model;

import com.test.qoldanqolga.notification.NotificationCategory;
import com.test.qoldanqolga.notification.NotificationEntityType;
import com.test.qoldanqolga.notification.NotificationType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notifications_user_created", columnList = "user_id, created_at"),
        @Index(name = "idx_notifications_user_unread", columnList = "user_id, is_read")
})
@Getter
@Setter
public class Notification extends BaseEntity {

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 64)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private NotificationCategory category;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 500)
    private String body;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", length = 32)
    private NotificationEntityType entityType;

    @Column(name = "entity_id", length = 36)
    private String entityId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, String> payload;

    @Column(name = "group_key", length = 128)
    private String groupKey;

    @Column(name = "group_count", nullable = false)
    private Integer groupCount = 1;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column(name = "read_at")
    private Instant readAt;

    @Column(name = "push_sent", nullable = false)
    private Boolean pushSent = false;
}
