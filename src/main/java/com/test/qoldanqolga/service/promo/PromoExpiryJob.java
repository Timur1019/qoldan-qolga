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
import java.util.List;

@Component
@RequiredArgsConstructor
public class PromoExpiryJob {

    private final PromoAdvertisementRepository promoAdvertisementRepository;
    private final AdvertisementRepository advertisementRepository;

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
        }
        LogUtil.info(PromoExpiryJob.class, "Promo expired cleared: count={}", expired.size());
    }
}
