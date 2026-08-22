package com.test.qoldanqolga.service.notification.impl;

import com.test.qoldanqolga.service.notification.AuthLoginNotificationPublisher;
import com.test.qoldanqolga.service.notification.LoginDeviceTracker;
import com.test.qoldanqolga.service.notification.NotificationEventFactory;
import com.test.qoldanqolga.service.notification.NotificationService;
import com.test.qoldanqolga.util.AfterCommit;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthLoginNotificationPublisherImpl implements AuthLoginNotificationPublisher {

    private final NotificationService notificationService;
    private final LoginDeviceTracker loginDeviceTracker;

    @Override
    public void publishLogin(String userId, String deviceId, String platform) {
        AfterCommit.run(() -> {
            if (deviceId != null && !deviceId.isBlank()) {
                boolean isNewDevice = loginDeviceTracker.registerAndIsNew(userId, deviceId, platform);
                if (isNewDevice) {
                    notificationService.publish(NotificationEventFactory.newDeviceLogin(userId, deviceId));
                    return;
                }
            }
            notificationService.publish(NotificationEventFactory.newLogin(userId));
        });
    }
}
