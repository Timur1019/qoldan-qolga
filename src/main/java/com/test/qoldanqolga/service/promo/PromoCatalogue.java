package com.test.qoldanqolga.service.promo;

import com.test.qoldanqolga.dto.promo.PromoServiceDto;

import java.util.List;

public interface PromoCatalogue {

    List<PromoServiceDto> getAll();

    boolean exists(String code);

    PromoProperties.PromoServiceConfig require(String code);
}
