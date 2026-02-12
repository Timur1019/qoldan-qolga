package com.test.qoldanqolga.service.promo.impl;

import com.test.qoldanqolga.dto.promo.CreatePromoOrderRequest;
import com.test.qoldanqolga.dto.promo.PromoServiceDto;
import com.test.qoldanqolga.service.PromoService;
import com.test.qoldanqolga.service.promo.PromoCatalogue;
import com.test.qoldanqolga.service.promo.PromoOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Оркестратор промо-услуг: делегирует в PromoCatalogue и PromoOrderService.
 */
@Service
@RequiredArgsConstructor
public class PromoServiceImpl implements PromoService {

    private final PromoCatalogue promoCatalogue;
    private final PromoOrderService promoOrderService;

    @Override
    public List<PromoServiceDto> getServices() {
        return promoCatalogue.getAll();
    }

    @Override
    public void createOrder(String adId, CreatePromoOrderRequest request, String userId) {
        String serviceCode = request.getServiceCodeTrimmed();
        promoOrderService.createOrder(adId, serviceCode, userId);
    }
}
