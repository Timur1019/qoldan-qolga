package com.test.qoldanqolga.dto.promo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PromoOrderResponse {
    private String orderId;
    private String paymentUrl;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String provider;
    private String serviceCode;
}
