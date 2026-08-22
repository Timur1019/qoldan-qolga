package com.test.qoldanqolga.service.notification;

import com.test.qoldanqolga.dto.notification.NotificationEvent;
import com.test.qoldanqolga.model.PromoOrder;

public interface PaymentNotificationPublisher {

    void publishPending(PromoOrder order);

    void publishSuccess(PromoOrder order);

    void publishFailed(PromoOrder order);
}
