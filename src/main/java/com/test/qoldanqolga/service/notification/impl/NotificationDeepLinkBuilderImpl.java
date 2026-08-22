package com.test.qoldanqolga.service.notification.impl;

import com.test.qoldanqolga.dto.notification.NotificationEvent;
import com.test.qoldanqolga.model.Notification;
import com.test.qoldanqolga.notification.NotificationCategory;
import com.test.qoldanqolga.notification.NotificationEntityType;
import com.test.qoldanqolga.notification.NotificationType;
import com.test.qoldanqolga.service.notification.NotificationDeepLinkBuilder;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class NotificationDeepLinkBuilderImpl implements NotificationDeepLinkBuilder {

    @Override
    public Map<String, String> buildPayload(NotificationEvent event) {
        Map<String, String> payload = new HashMap<>();
        if (event.getPayload() != null) {
            payload.putAll(event.getPayload());
        }
        payload.put("type", event.getType().name());
        if (event.getEntityType() != null) {
            payload.put("entityType", event.getEntityType().name());
        }
        if (event.getEntityId() != null) {
            payload.put("entityId", event.getEntityId());
        }
        enrichLegacyKeys(payload, event);
        return payload;
    }

    @Override
    public Map<String, Object> buildPushData(Notification notification) {
        Map<String, Object> data = new HashMap<>();
        data.put("type", notification.getType().name());
        if (notification.getEntityType() != null) {
            data.put("entityType", notification.getEntityType().name());
        }
        if (notification.getEntityId() != null) {
            data.put("entityId", notification.getEntityId());
        }
        if (notification.getPayload() != null) {
            notification.getPayload().forEach(data::put);
        }
        enrichLegacyPushKeys(data, notification);
        return data;
    }

    private static void enrichLegacyKeys(Map<String, String> payload, NotificationEvent event) {
        if (event.getEntityType() == NotificationEntityType.CHAT && event.getEntityId() != null) {
            payload.putIfAbsent("chatId", event.getEntityId());
            payload.putIfAbsent("conversationId", event.getEntityId());
        }
        if (event.getEntityType() == NotificationEntityType.AD && event.getEntityId() != null) {
            payload.putIfAbsent("adId", event.getEntityId());
            payload.putIfAbsent("listingId", event.getEntityId());
        }
    }

    private static void enrichLegacyPushKeys(Map<String, Object> data, Notification notification) {
        if (notification.getEntityType() == NotificationEntityType.CHAT && notification.getEntityId() != null) {
            data.putIfAbsent("chatId", notification.getEntityId());
            data.putIfAbsent("conversationId", notification.getEntityId());
        }
        if (notification.getEntityType() == NotificationEntityType.AD && notification.getEntityId() != null) {
            data.putIfAbsent("adId", notification.getEntityId());
            data.putIfAbsent("listingId", notification.getEntityId());
        }
        if (notification.getCategory() == NotificationCategory.PROMOTION
                && notification.getEntityId() != null) {
            data.putIfAbsent("adId", notification.getEntityId());
        }
    }
}
