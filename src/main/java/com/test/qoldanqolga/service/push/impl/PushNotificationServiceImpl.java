package com.test.qoldanqolga.service.push.impl;

import com.test.qoldanqolga.model.DevicePushToken;
import com.test.qoldanqolga.model.PushChannel;
import com.test.qoldanqolga.repository.DevicePushTokenRepository;
import com.test.qoldanqolga.service.push.ExpoPushClient;
import com.test.qoldanqolga.service.push.PushNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

@Service
@RequiredArgsConstructor
public class PushNotificationServiceImpl implements PushNotificationService {

    private final DevicePushTokenRepository devicePushTokenRepository;
    private final ExpoPushClient expoPushClient;

    @Override
    @Async("pushExecutor")
    public void notifyChatMessage(String recipientUserId, String conversationId, String preview) {
        send(
                recipientUserId,
                DevicePushToken::getChatEnabled,
                "Сообщение",
                clip(preview, "Новое сообщение"),
                Map.of("type", PushChannel.CHAT, "conversationId", conversationId),
                "chat"
        );
    }

    @Override
    @Async("pushExecutor")
    public void notifySystem(String recipientUserId, String conversationId, String title, String body) {
        send(
                recipientUserId,
                DevicePushToken::getSystemEnabled,
                title,
                clip(body, title),
                Map.of("type", PushChannel.SYSTEM, "conversationId", conversationId),
                "system"
        );
    }

    @Override
    @Async("pushExecutor")
    public void notifyPromo(String recipientUserId, String adId, String title, String body) {
        send(
                recipientUserId,
                DevicePushToken::getPromoEnabled,
                title,
                clip(body, title),
                Map.of("type", PushChannel.PROMO, "adId", adId != null ? adId : ""),
                "promo"
        );
    }

    private void send(
            String recipientUserId,
            Predicate<DevicePushToken> enabled,
            String title,
            String body,
            Map<String, Object> data,
            String channelId
    ) {
        if (recipientUserId == null || recipientUserId.isBlank()) {
            return;
        }
        List<DevicePushToken> tokens = devicePushTokenRepository.findByUserIdAndDeletedAtIsNull(recipientUserId);
        for (DevicePushToken token : tokens) {
            if (!Boolean.TRUE.equals(enabled.test(token))) {
                continue;
            }
            expoPushClient.send(token.getToken(), title, body, data, channelId);
        }
    }

    private static String clip(String text, String fallback) {
        String body = text == null || text.isBlank() ? fallback : text.trim();
        if (body.length() > 140) {
            return body.substring(0, 137) + "…";
        }
        return body;
    }
}
