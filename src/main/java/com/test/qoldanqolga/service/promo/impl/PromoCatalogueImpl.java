package com.test.qoldanqolga.service.promo.impl;

import com.test.qoldanqolga.dto.promo.PromoServiceDto;
import com.test.qoldanqolga.exception.UnsupportedPromoServiceException;
import com.test.qoldanqolga.service.promo.PromoCatalogue;
import com.test.qoldanqolga.service.promo.PromoProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PromoCatalogueImpl implements PromoCatalogue {

    private final PromoProperties promoProperties;

    @Override
    public List<PromoServiceDto> getAll() {
        return promoProperties.toPromoServiceDtoList();
    }

    @Override
    public boolean exists(String code) {
        return promoProperties.findByCode(code).isPresent();
    }

    @Override
    public PromoProperties.PromoServiceConfig require(String code) {
        return promoProperties.findByCode(code)
                .orElseThrow(() -> new UnsupportedPromoServiceException(code == null || code.isBlank() ? "(пусто)" : code));
    }
}
