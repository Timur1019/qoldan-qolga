package com.test.qoldanqolga.service.notification.impl;

import com.test.qoldanqolga.model.DevicePushToken;
import com.test.qoldanqolga.model.Notification;
import com.test.qoldanqolga.model.NotificationDeliveryLog;
import com.test.qoldanqolga.notification.NotificationCategory;
import com.test.qoldanqolga.notification.NotificationDeliveryStatus;
import com.test.qoldanqolga.repository.DevicePushTokenRepository;
import com.test.qoldanqolga.repository.NotificationDeliveryLogRepository;
import com.test.qoldanqolga.repository.NotificationPreferenceRepository;
import com.test.qoldanqolga.repository.NotificationRepository;
import com.test.qoldanqolga.service.notification.NotificationDeepLinkBuilder;
import com.test.qoldanqolga.service.notification.NotificationPushDispatcher;
import com.test.qoldanqolga.service.push.ExpoPushClient;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

@Service
@RequiredArgsConstructor
public class NotificationPushDispatcherImpl implements NotificationPushDispatcher {

    private final DevicePushTokenRepository devicePushTokenRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final NotificationDeliveryLogRepository deliveryLogRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationDeepLinkBuilder deepLinkBuilder;
    private final ExpoPushClient expoPushClient;

    @Override
    @Async("pushExecutor")
    public void dispatch(Notification notification) {
        if (notification == null || notification.getUserId() == null) {
            return;
        }
        if (!Boolean.TRUE.equals(notification.getType().isPushEnabled())) {
            return;
        }
        if (!shouldSendPush(notification)) {
            return;
        }

        List<DevicePushToken> tokens = devicePushTokenRepository.findByUserIdAndDeletedAtIsNull(notification.getUserId());
        if (tokens.isEmpty()) {
            return;
        }

        Predicate<DevicePushToken> enabled = tokenFilter(notification.getCategory());
        Map<String, Object> data = deepLinkBuilder.buildPushData(notification);
        String channelId = resolveChannelId(notification.getCategory());
        String title = notification.getTitle();
        String body = clip(notification.getBody());

        boolean anySent = false;
        for (DevicePushToken token : tokens) {
            if (!enabled.test(token)) {
                continue;
            }
            try {
                expoPushClient.send(token.getToken(), title, body, data, channelId);
                logDelivery(notification.getId(), token.getId(), NotificationDeliveryStatus.SENT, null);
                anySent = true;
            } catch (Exception e) {
                logDelivery(notification.getId(), token.getId(), NotificationDeliveryStatus.FAILED, e.getMessage());
                LogUtil.warn(NotificationPushDispatcherImpl.class, "Push dispatch failed: {}", e.getMessage());
            }
        }

        if (anySent) {
            notification.setPushSent(true);
            notificationRepository.save(notification);
        }
    }

    private boolean shouldSendPush(Notification notification) {
        if (notification.getType().isMandatory()) {
            return true;
        }
        return preferenceRepository.findByUserIdAndDeletedAtIsNull(notification.getUserId())
                .map(prefs -> {
                    if (!Boolean.TRUE.equals(prefs.getPushEnabled())) {
                        return false;
                    }
                    return isCategoryEnabled(prefs, notification.getCategory());
                })
                .orElse(true);
    }

    private static boolean isCategoryEnabled(com.test.qoldanqolga.model.NotificationPreference prefs,
                                             NotificationCategory category) {
        return switch (category) {
            case CHAT -> Boolean.TRUE.equals(prefs.getChatEnabled());
            case FAVORITE -> Boolean.TRUE.equals(prefs.getFavoriteEnabled());
            case AD -> Boolean.TRUE.equals(prefs.getAdEnabled());
            case PROMOTION -> Boolean.TRUE.equals(prefs.getPromotionEnabled());
            case PAYMENT -> Boolean.TRUE.equals(prefs.getPaymentEnabled());
            case PROFILE -> Boolean.TRUE.equals(prefs.getProfileEnabled());
            case DEAL -> Boolean.TRUE.equals(prefs.getDealEnabled());
            case REGIONAL -> Boolean.TRUE.equals(prefs.getRegionalEnabled());
            case MARKETING -> Boolean.TRUE.equals(prefs.getMarketingEnabled());
            case SECURITY -> true;
        };
    }

    private static Predicate<DevicePushToken> tokenFilter(NotificationCategory category) {
        return switch (category) {
            case CHAT -> DevicePushToken::getChatEnabled;
            case PROMOTION, PAYMENT, MARKETING -> DevicePushToken::getPromoEnabled;
            default -> DevicePushToken::getSystemEnabled;
        };
    }

    private static String resolveChannelId(NotificationCategory category) {
        return switch (category) {
            case CHAT -> "chat";
            case PROMOTION, PAYMENT, MARKETING -> "promo";
            default -> "system";
        };
    }

    private void logDelivery(String notificationId, String tokenId, NotificationDeliveryStatus status, String error) {
        NotificationDeliveryLog log = new NotificationDeliveryLog();
        log.setNotificationId(notificationId);
        log.setDeviceTokenId(tokenId);
        log.setStatus(status);
        log.setErrorMessage(error);
        deliveryLogRepository.save(log);
    }

    private static String clip(String text) {
        if (text == null || text.isBlank()) {
            return "";
        }
        String body = text.trim();
        if (body.length() > 140) {
            return body.substring(0, 137) + "…";
        }
        return body;
    }
}
