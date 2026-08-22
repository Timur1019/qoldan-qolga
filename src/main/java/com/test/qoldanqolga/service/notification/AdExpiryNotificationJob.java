package com.test.qoldanqolga.service.notification;

import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.notification.NotificationType;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.NotificationRepository;
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
public class AdExpiryNotificationJob {

    private final AdvertisementRepository advertisementRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 30 9 * * *")
    @Transactional
    public void notifyExpiringAds() {
        Instant now = Instant.now();
        Instant tomorrow = now.plus(1, ChronoUnit.DAYS);
        List<Advertisement> expiring = advertisementRepository.findExpiringBetween(now, tomorrow);
        for (Advertisement ad : expiring) {
            if (ad.getUserId() == null) {
                continue;
            }
            if (alreadyNotified(ad.getUserId(), NotificationType.AD_EXPIRING, ad.getId(), now.minus(20, ChronoUnit.HOURS))) {
                continue;
            }
            AfterCommit.run(() -> notificationService.publish(
                    NotificationEventFactory.adExpiring(ad.getUserId(), ad)));
        }
        if (!expiring.isEmpty()) {
            LogUtil.info(AdExpiryNotificationJob.class, "Ad expiring notifications: count={}", expiring.size());
        }
    }

    @Scheduled(cron = "0 45 9 * * *")
    @Transactional
    public void notifyExpiredAds() {
        Instant now = Instant.now();
        List<Advertisement> expired = advertisementRepository.findExpiredActive(now);
        for (Advertisement ad : expired) {
            if (ad.getUserId() == null) {
                continue;
            }
            if (alreadyNotified(ad.getUserId(), NotificationType.AD_EXPIRED, ad.getId(), now.minus(20, ChronoUnit.HOURS))) {
                continue;
            }
            AfterCommit.run(() -> notificationService.publish(
                    NotificationEventFactory.adExpired(ad.getUserId(), ad)));
        }
        if (!expired.isEmpty()) {
            LogUtil.info(AdExpiryNotificationJob.class, "Ad expired notifications: count={}", expired.size());
        }
    }

    private boolean alreadyNotified(String userId, NotificationType type, String entityId, Instant since) {
        return notificationRepository.existsByUserIdAndTypeAndEntityIdAndCreatedAtAfterAndDeletedAtIsNull(
                userId, type, entityId, since);
    }
}
