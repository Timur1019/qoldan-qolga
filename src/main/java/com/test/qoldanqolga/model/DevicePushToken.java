package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "device_push_tokens", indexes = {
        @Index(name = "idx_push_tokens_user", columnList = "user_id")
})
@Getter
@Setter
public class DevicePushToken extends BaseEntity {

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(nullable = false, unique = true, length = 255)
    private String token;

    @Column(nullable = false, length = 16)
    private String platform;

    @Column(name = "chat_enabled", nullable = false)
    private Boolean chatEnabled = true;

    @Column(name = "system_enabled", nullable = false)
    private Boolean systemEnabled = true;

    @Column(name = "promo_enabled", nullable = false)
    private Boolean promoEnabled = true;

    @Column(name = "device_id", length = 64)
    private String deviceId;

    @Column(name = "app_version", length = 32)
    private String appVersion;

    @Column(length = 8)
    private String language;

    @Column(name = "last_seen")
    private java.time.Instant lastSeen;
}
