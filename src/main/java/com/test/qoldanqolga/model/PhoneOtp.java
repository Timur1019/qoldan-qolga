package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "phone_otps")
@Getter
@Setter
public class PhoneOtp extends BaseEntity {

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(name = "code_hash", nullable = false, length = 255)
    private String codeHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PhoneOtpStatus status = PhoneOtpStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "sms_status", nullable = false, length = 20)
    private SmsDeliveryStatus smsStatus = SmsDeliveryStatus.PENDING;

    @Column(nullable = false)
    private Integer attempts = 0;

    @Column(name = "sms_id")
    private Long smsId;

    @Column(name = "request_id", length = 100)
    private String requestId;

    @Column(name = "parts_count")
    private Integer partsCount;

    @Column(name = "total_cost")
    private Integer totalCost;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "sent_at")
    private Instant sentAt;

    @Column(name = "delivered_at")
    private Instant deliveredAt;

    @Column(name = "failed_at")
    private Instant failedAt;
}
