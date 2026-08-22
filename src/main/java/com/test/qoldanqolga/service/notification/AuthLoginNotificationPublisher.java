package com.test.qoldanqolga.service.notification;

public interface AuthLoginNotificationPublisher {

    void publishLogin(String userId, String deviceId, String platform);
}
