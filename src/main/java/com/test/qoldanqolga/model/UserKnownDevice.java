package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "user_known_devices", indexes = {
        @Index(name = "idx_known_devices_user_device", columnList = "user_id, device_id", unique = true)
})
@Getter
@Setter
public class UserKnownDevice extends BaseEntity {

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "device_id", nullable = false, length = 64)
    private String deviceId;

    @Column(length = 16)
    private String platform;

    @Column(name = "last_seen_at")
    private Instant lastSeenAt;
}
