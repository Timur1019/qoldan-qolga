package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.promo.CreatePromoOrderRequest;
import com.test.qoldanqolga.dto.promo.PromoOrderResponse;
import com.test.qoldanqolga.dto.promo.PromoServiceDto;

import java.util.List;

public interface PromoService {

    List<PromoServiceDto> getServices();

    PromoOrderResponse createOrder(String adId, CreatePromoOrderRequest request, String userId);

    PromoOrderResponse getOrder(String orderId, String userId);
}
