package com.test.qoldanqolga.service.notification;

import com.test.qoldanqolga.dto.notification.NotificationEvent;
import com.test.qoldanqolga.model.Notification;

import java.util.Map;

public interface NotificationDeepLinkBuilder {

    Map<String, String> buildPayload(NotificationEvent event);

    Map<String, Object> buildPushData(Notification notification);
}
