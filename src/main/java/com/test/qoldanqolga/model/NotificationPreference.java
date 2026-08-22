package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "notification_preferences", indexes = {
        @Index(name = "idx_notification_prefs_user", columnList = "user_id", unique = true)
})
@Getter
@Setter
public class NotificationPreference extends BaseEntity {

    @Column(name = "user_id", nullable = false, unique = true, length = 36)
    private String userId;

    @Column(name = "push_enabled", nullable = false)
    private Boolean pushEnabled = true;

    @Column(name = "chat_enabled", nullable = false)
    private Boolean chatEnabled = true;

    @Column(name = "favorite_enabled", nullable = false)
    private Boolean favoriteEnabled = true;

    @Column(name = "ad_enabled", nullable = false)
    private Boolean adEnabled = true;

    @Column(name = "promotion_enabled", nullable = false)
    private Boolean promotionEnabled = true;

    @Column(name = "payment_enabled", nullable = false)
    private Boolean paymentEnabled = true;

    @Column(name = "profile_enabled", nullable = false)
    private Boolean profileEnabled = true;

    @Column(name = "deal_enabled", nullable = false)
    private Boolean dealEnabled = true;

    @Column(name = "regional_enabled", nullable = false)
    private Boolean regionalEnabled = true;

    @Column(name = "marketing_enabled", nullable = false)
    private Boolean marketingEnabled = false;

    @Column(name = "quiet_hours_enabled", nullable = false)
    private Boolean quietHoursEnabled = false;

    @Column(name = "quiet_hours_start", length = 5)
    private String quietHoursStart;

    @Column(name = "quiet_hours_end", length = 5)
    private String quietHoursEnd;
}
