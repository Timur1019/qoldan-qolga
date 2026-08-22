package com.test.qoldanqolga.service.notification;

import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.notification.NotificationType;
import com.test.qoldanqolga.repository.NotificationRepository;
import com.test.qoldanqolga.repository.PromoAdvertisementRepository;
import com.test.qoldanqolga.util.AfterCommit;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PromoExpiringNotificationJob {

    private final PromoAdvertisementRepository promoAdvertisementRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 10 * * *")
    @Transactional(readOnly = true)
    public void notifyExpiringPromos() {
        Instant now = Instant.now();
        Instant tomorrow = now.plus(1, ChronoUnit.DAYS);
        List<Advertisement> expiring = promoAdvertisementRepository.findPromoExpiringBetween(now, tomorrow);
        for (Advertisement ad : expiring) {
            if (ad.getUserId() == null) {
                continue;
            }
            if (notificationRepository.existsByUserIdAndTypeAndEntityIdAndCreatedAtAfterAndDeletedAtIsNull(
                    ad.getUserId(), NotificationType.PROMOTION_EXPIRING, ad.getId(), now.minus(20, ChronoUnit.HOURS))) {
                continue;
            }
            AfterCommit.run(() -> notificationService.publish(
                    NotificationEventFactory.promotionExpiring(ad.getUserId(), ad)));
        }
        if (!expiring.isEmpty()) {
            LogUtil.info(PromoExpiringNotificationJob.class, "Promo expiring notifications: count={}", expiring.size());
        }
    }
}
