package com.test.qoldanqolga.service.promo;

import com.test.qoldanqolga.dto.promo.PromoServiceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Каталог промо-услуг. Разделяет ответственность: только предоставление списка.
 */
@Component
@RequiredArgsConstructor
public class PromoCatalogue {

    private final PromoProperties promoProperties;

    public List<PromoServiceDto> getAll() {
        return promoProperties.toPromoServiceDtoList();
    }

    public boolean exists(String code) {
        if (code == null || code.isBlank()) {
            return false;
        }
        return promoProperties.getServices().containsKey(code.trim().toLowerCase());
    }
}
