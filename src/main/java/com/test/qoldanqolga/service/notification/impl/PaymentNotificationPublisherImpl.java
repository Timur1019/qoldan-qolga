package com.test.qoldanqolga.service.notification.impl;

import com.test.qoldanqolga.model.PromoOrder;
import com.test.qoldanqolga.service.notification.NotificationEventFactory;
import com.test.qoldanqolga.service.notification.NotificationService;
import com.test.qoldanqolga.service.notification.PaymentNotificationPublisher;
import com.test.qoldanqolga.util.AfterCommit;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentNotificationPublisherImpl implements PaymentNotificationPublisher {

    private final NotificationService notificationService;

    @Override
    public void publishPending(PromoOrder order) {
        AfterCommit.run(() -> notificationService.publish(NotificationEventFactory.paymentPending(order)));
    }

    @Override
    public void publishSuccess(PromoOrder order) {
        AfterCommit.run(() -> {
            notificationService.publish(NotificationEventFactory.paymentSuccess(order));
            notificationService.publish(NotificationEventFactory.promotionPaid(order));
        });
    }

    @Override
    public void publishFailed(PromoOrder order) {
        AfterCommit.run(() -> notificationService.publish(NotificationEventFactory.paymentFailed(order)));
    }
}
