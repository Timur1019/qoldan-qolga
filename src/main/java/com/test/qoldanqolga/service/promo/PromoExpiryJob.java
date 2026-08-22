package com.test.qoldanqolga.service.promo;

import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.notification.NotificationType;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.NotificationRepository;
import com.test.qoldanqolga.repository.PromoAdvertisementRepository;
import com.test.qoldanqolga.service.notification.NotificationEventFactory;
import com.test.qoldanqolga.service.notification.NotificationService;
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
public class PromoExpiryJob {

    private final PromoAdvertisementRepository promoAdvertisementRepository;
    private final AdvertisementRepository advertisementRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 15 * * * *")
    @Transactional
    public void expirePromos() {
        Instant now = Instant.now();
        List<Advertisement> expired = promoAdvertisementRepository.findExpiredPromo(now);
        if (expired.isEmpty()) {
            return;
        }
        for (Advertisement ad : expired) {
            ad.setIsVip(false);
            ad.setIsTop(false);
            ad.setIsHighlighted(false);
            ad.setPromoPriority(0);
            ad.setBoostIntervalHours(null);
            ad.setNextBoostAt(null);
            advertisementRepository.save(ad);
            if (ad.getUserId() != null
                    && !notificationRepository.existsByUserIdAndTypeAndEntityIdAndCreatedAtAfterAndDeletedAtIsNull(
                    ad.getUserId(), NotificationType.PROMOTION_EXPIRED, ad.getId(), now.minus(20, ChronoUnit.HOURS))) {
                AfterCommit.run(() -> notificationService.publish(
                        NotificationEventFactory.promotionExpired(ad.getUserId(), ad)));
            }
        }
        LogUtil.info(PromoExpiryJob.class, "Promo expired cleared: count={}", expired.size());
    }
}
