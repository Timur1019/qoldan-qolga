package com.test.qoldanqolga.service.promo;

import com.test.qoldanqolga.constant.AdConstants;
import com.test.qoldanqolga.exception.AdAccessDeniedException;
import com.test.qoldanqolga.exception.AdvertisementNotActiveException;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.exception.UnsupportedPromoServiceException;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Создание заказов на промо-услуги. Отдельная ответственность.
 * TODO: PAY-XXX — интеграция с платёжным шлюзом, сохранение заказа в БД
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PromoOrderService {

    private final AdvertisementRepository advertisementRepository;
    private final PromoCatalogue promoCatalogue;

    @Transactional(readOnly = true)
    public void createOrder(String adId, String serviceCode, String userId) {
        Advertisement ad = advertisementRepository.findById(adId)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", adId));

        validateOwnership(ad, userId);
        validateAdvertisementActive(ad);
        validateServiceCode(serviceCode);

        log.debug("Promo order requested: adId={} service={} userId={}", adId, serviceCode, userId);
        // TODO: PAY-XXX — сохранить заказ в БД, вызов платёжного провайдера
    }

    private void validateOwnership(Advertisement ad, String userId) {
        if (!ad.getUserId().equals(userId)) {
            throw new AdAccessDeniedException(ad.getId(), userId);
        }
    }

    private void validateAdvertisementActive(Advertisement ad) {
        if (!AdConstants.STATUS_ACTIVE.equals(ad.getStatus())) {
            throw new AdvertisementNotActiveException(ad.getId());
        }
    }

    private void validateServiceCode(String serviceCode) {
        String code = serviceCode != null ? serviceCode.trim() : "";
        if (!promoCatalogue.exists(code)) {
            throw new UnsupportedPromoServiceException(code.isEmpty() ? "(пусто)" : code);
        }
    }
}
