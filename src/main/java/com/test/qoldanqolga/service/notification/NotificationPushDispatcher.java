package com.test.qoldanqolga.service.notification;

import com.test.qoldanqolga.model.Notification;

public interface NotificationPushDispatcher {

    void dispatch(Notification notification);
}
