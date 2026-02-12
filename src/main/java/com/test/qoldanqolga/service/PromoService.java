package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.promo.PromoServiceDto;
import com.test.qoldanqolga.dto.promo.CreatePromoOrderRequest;

import java.util.List;

public interface PromoService {

    List<PromoServiceDto> getServices();

    void createOrder(String adId, CreatePromoOrderRequest request, String userId);
}
