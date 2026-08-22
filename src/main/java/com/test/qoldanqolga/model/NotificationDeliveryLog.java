package com.test.qoldanqolga.model;

import com.test.qoldanqolga.notification.NotificationDeliveryStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "notification_delivery_logs", indexes = {
        @Index(name = "idx_notification_delivery_notification", columnList = "notification_id"),
        @Index(name = "idx_notification_delivery_token", columnList = "device_token_id")
})
@Getter
@Setter
public class NotificationDeliveryLog extends BaseEntity {

    @Column(name = "notification_id", nullable = false, length = 36)
    private String notificationId;

    @Column(name = "device_token_id", length = 36)
    private String deviceTokenId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private NotificationDeliveryStatus status;

    @Column(name = "error_message", length = 500)
    private String errorMessage;
}
