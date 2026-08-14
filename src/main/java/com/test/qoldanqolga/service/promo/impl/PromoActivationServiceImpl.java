package com.test.qoldanqolga.service.promo.impl;

import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.exception.UnsupportedPromoServiceException;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.model.PromoOrder;
import com.test.qoldanqolga.model.PromoOrderStatus;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.PromoOrderRepository;
import com.test.qoldanqolga.service.promo.PromoActivationService;
import com.test.qoldanqolga.service.promo.PromoProperties;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class PromoActivationServiceImpl implements PromoActivationService {

    private final PromoOrderRepository promoOrderRepository;
    private final AdvertisementRepository advertisementRepository;
    private final PromoProperties promoProperties;

    @Override
    @Transactional
    public void activatePaidOrder(String orderId) {
        PromoOrder order = promoOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Заказ промо", orderId));
        activatePaidOrder(order);
    }

    @Override
    @Transactional
    public void activatePaidOrder(PromoOrder order) {
        if (order == null) {
            return;
        }
        if (PromoOrderStatus.PAID.equals(order.getStatus()) && order.getPaidAt() != null) {
            // повторный колбэк — флаги уже применены при первой активации
            return;
        }

        PromoProperties.PromoServiceConfig plan = promoProperties.findByCode(order.getServiceCode())
                .orElseThrow(() -> new UnsupportedPromoServiceException(order.getServiceCode()));

        Advertisement ad = advertisementRepository.findById(order.getAdId())
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", order.getAdId()));

        Instant now = Instant.now();
        Instant newUntil = now.plus(plan.getDuration(), ChronoUnit.DAYS);
        if (ad.getPromoUntil() != null && ad.getPromoUntil().isAfter(now)) {
            Instant extended = ad.getPromoUntil().plus(plan.getDuration(), ChronoUnit.DAYS);
            if (extended.isAfter(newUntil)) {
                newUntil = extended;
            }
        }

        int priority = Math.max(
                ad.getPromoPriority() != null ? ad.getPromoPriority() : 0,
                plan.getPriority()
        );

        ad.setIsVip(Boolean.TRUE.equals(ad.getIsVip()) || plan.isVip());
        ad.setIsTop(Boolean.TRUE.equals(ad.getIsTop()) || plan.isTop());
        ad.setIsHighlighted(Boolean.TRUE.equals(ad.getIsHighlighted()) || plan.isHighlight());
        ad.setPromoPriority(priority);
        ad.setPromoUntil(newUntil);
        ad.setBoostedAt(now);

        int interval = plan.getBoostIntervalHours();
        if (interval > 0) {
            ad.setBoostIntervalHours(interval);
            ad.setNextBoostAt(now.plus(interval, ChronoUnit.HOURS));
        } else {
            // разовое поднятие (day1)
            Integer existing = ad.getBoostIntervalHours();
            if (existing == null || existing <= 0) {
                ad.setBoostIntervalHours(null);
                ad.setNextBoostAt(null);
            }
        }

        advertisementRepository.save(ad);

        order.setStatus(PromoOrderStatus.PAID);
        order.setPaidAt(now);
        promoOrderRepository.save(order);

        LogUtil.info(PromoActivationServiceImpl.class,
                "Promo activated: orderId={} adId={} plan={} until={} priority={}",
                order.getId(), ad.getId(), plan.getCode(), newUntil, priority);
    }
}
