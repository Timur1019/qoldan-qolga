package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "promo_orders", indexes = {
        @Index(name = "idx_promo_orders_ad", columnList = "ad_id"),
        @Index(name = "idx_promo_orders_user", columnList = "user_id"),
        @Index(name = "idx_promo_orders_status", columnList = "status")
})
@Getter
@Setter
public class PromoOrder extends BaseEntity {

    @Column(name = "ad_id", nullable = false, length = 36)
    private String adId;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "service_code", nullable = false, length = 32)
    private String serviceCode;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency = "UZS";

    @Column(nullable = false, length = 20)
    private String status = "PENDING";

    @Column(nullable = false, length = 20)
    private String provider;

    @Column(name = "provider_txn_id", length = 128)
    private String providerTxnId;

    @Column(name = "payment_url", length = 1024)
    private String paymentUrl;

    @Column(name = "paid_at")
    private Instant paidAt;
}
