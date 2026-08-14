package com.test.qoldanqolga.service.promo;

import com.test.qoldanqolga.model.PromoOrder;

public interface PromoActivationService {

    void activatePaidOrder(String orderId);

    void activatePaidOrder(PromoOrder order);
}
