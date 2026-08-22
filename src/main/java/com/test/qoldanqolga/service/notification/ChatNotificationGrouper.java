package com.test.qoldanqolga.service.notification;

import com.test.qoldanqolga.dto.notification.NotificationEvent;
import com.test.qoldanqolga.model.Notification;

public interface ChatNotificationGrouper {

    /**
     * Returns existing grouped notification to update, or null to create a new one.
     */
    Notification findGroupable(NotificationEvent event);

    String buildGroupKey(NotificationEvent event);

    String buildGroupedBody(int count);
}
