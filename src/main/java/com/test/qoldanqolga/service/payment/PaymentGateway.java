package com.test.qoldanqolga.service.payment;

import com.test.qoldanqolga.model.PromoOrder;

public interface PaymentGateway {

    String provider();

    String createCheckout(PromoOrder order);
}
