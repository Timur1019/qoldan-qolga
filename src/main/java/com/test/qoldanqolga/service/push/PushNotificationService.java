package com.test.qoldanqolga.service.push;

public interface PushNotificationService {

    void notifyChatMessage(String recipientUserId, String conversationId, String preview);

    void notifySystem(String recipientUserId, String conversationId, String title, String body);

    void notifyPromo(String recipientUserId, String adId, String title, String body);
}
