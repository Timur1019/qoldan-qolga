package com.test.qoldanqolga.notification;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationType {

    // Chat
    NEW_MESSAGE(NotificationCategory.CHAT, true, false),
    MESSAGE_REPLY(NotificationCategory.CHAT, true, false),
    VOICE_MESSAGE(NotificationCategory.CHAT, true, false),
    PHOTO_MESSAGE(NotificationCategory.CHAT, true, false),
    NEW_CONVERSATION(NotificationCategory.CHAT, true, false),

    // Favorite
    FAVORITE_ADDED(NotificationCategory.FAVORITE, true, false),
    FAVORITE_PRICE_CHANGED(NotificationCategory.FAVORITE, true, false),
    FAVORITE_EXPIRING(NotificationCategory.FAVORITE, true, false),
    FAVORITE_SOLD(NotificationCategory.FAVORITE, true, false),
    FAVORITE_REPUBLISHED(NotificationCategory.FAVORITE, true, false),

    // Ads
    AD_PUBLISHED(NotificationCategory.AD, true, false),
    AD_MODERATED(NotificationCategory.AD, true, false),
    AD_REJECTED(NotificationCategory.AD, true, false),
    AD_HIDDEN(NotificationCategory.AD, true, false),
    AD_BLOCKED(NotificationCategory.AD, true, false),
    AD_EXPIRING(NotificationCategory.AD, true, false),
    AD_EXPIRED(NotificationCategory.AD, true, false),
    AD_SOLD(NotificationCategory.AD, true, false),
    AD_HIGH_VIEWS(NotificationCategory.AD, true, false),

    // Promotion
    PROMOTION_ACTIVE(NotificationCategory.PROMOTION, true, false),
    PROMOTION_EXPIRING(NotificationCategory.PROMOTION, true, false),
    PROMOTION_EXPIRED(NotificationCategory.PROMOTION, true, false),
    PROMOTION_VIEWS_MILESTONE(NotificationCategory.PROMOTION, true, false),
    PROMOTION_IN_TOP(NotificationCategory.PROMOTION, true, false),

    // Payment
    PAYMENT_SUCCESS(NotificationCategory.PAYMENT, true, false),
    PAYMENT_FAILED(NotificationCategory.PAYMENT, true, false),
    PAYMENT_PENDING(NotificationCategory.PAYMENT, true, false),
    PAYMENT_REFUND(NotificationCategory.PAYMENT, true, false),
    PROMOTION_PAID(NotificationCategory.PAYMENT, true, false),
    SUBSCRIPTION_ACTIVE(NotificationCategory.PAYMENT, true, false),
    SUBSCRIPTION_EXPIRING(NotificationCategory.PAYMENT, true, false),

    // Security — mandatory, cannot be disabled
    NEW_LOGIN(NotificationCategory.SECURITY, true, true),
    NEW_DEVICE_LOGIN(NotificationCategory.SECURITY, true, true),
    PHONE_CHANGED(NotificationCategory.SECURITY, true, true),
    PASSWORD_CHANGED(NotificationCategory.SECURITY, true, true),
    EMAIL_CHANGED(NotificationCategory.SECURITY, true, true),
    SUSPICIOUS_ACTIVITY(NotificationCategory.SECURITY, true, true),
    ACCOUNT_BLOCKED(NotificationCategory.SECURITY, true, true),
    ACCOUNT_RESTORED(NotificationCategory.SECURITY, true, true),

    // Profile
    SELLER_SUBSCRIBED(NotificationCategory.PROFILE, true, false),
    NEW_REVIEW(NotificationCategory.PROFILE, true, false),
    REVIEW_REPLY(NotificationCategory.PROFILE, true, false),
    RATING_CHANGED(NotificationCategory.PROFILE, true, false),
    PROFILE_VERIFIED(NotificationCategory.PROFILE, true, false),

    // Deals (future-ready)
    DEAL_REQUEST(NotificationCategory.DEAL, true, false),
    DEAL_ACCEPTED(NotificationCategory.DEAL, true, false),
    DEAL_REJECTED(NotificationCategory.DEAL, true, false),
    DEAL_CONFIRMED(NotificationCategory.DEAL, true, false),
    DEAL_COMPLETED(NotificationCategory.DEAL, true, false),
    DEAL_CANCELLED(NotificationCategory.DEAL, true, false),
    REVIEW_REMINDER(NotificationCategory.DEAL, true, false),

    // Regional / smart (future-ready)
    SAVED_SEARCH_MATCH(NotificationCategory.REGIONAL, true, false),
    NEW_LISTING_IN_REGION(NotificationCategory.REGIONAL, true, false),

    // System inbox messages (legacy system chat channel)
    SYSTEM_MESSAGE(NotificationCategory.CHAT, true, false);

    private final NotificationCategory category;
    /** Whether this type should trigger a mobile push. */
    private final boolean pushEnabled;
    /** Security-critical — user cannot opt out. */
    private final boolean mandatory;

    public boolean isGroupable() {
        return category == NotificationCategory.CHAT && this != NEW_CONVERSATION && this != SYSTEM_MESSAGE;
    }
}
