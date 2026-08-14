package com.test.qoldanqolga.service.promo;

import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.PromoAdvertisementRepository;
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
public class PromoBoostJob {

    private final PromoAdvertisementRepository promoAdvertisementRepository;
    private final AdvertisementRepository advertisementRepository;

    @Scheduled(fixedDelay = 300_000, initialDelay = 60_000)
    @Transactional
    public void boostDueAds() {
        Instant now = Instant.now();
        List<Advertisement> due = promoAdvertisementRepository.findDueForBoost(now);
        if (due.isEmpty()) {
            return;
        }
        for (Advertisement ad : due) {
            Integer interval = ad.getBoostIntervalHours();
            if (interval == null || interval <= 0) {
                ad.setNextBoostAt(null);
                continue;
            }
            ad.setBoostedAt(now);
            ad.setNextBoostAt(now.plus(interval, ChronoUnit.HOURS));
            advertisementRepository.save(ad);
        }
        LogUtil.info(PromoBoostJob.class, "Promo boost applied: count={}", due.size());
    }
}
